from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
import razorpay
import os
from dotenv import load_dotenv

from app.db.database import get_db
from app.schemas.invioce_schema import CreateInvoiceRequest, PaymentProcessRequest ,CreateOrderRequest,  VerifyPaymentRequest
from app.routes import user

load_dotenv()

app = FastAPI(title="Razorpay Invoice API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

razorpay_client = razorpay.Client(auth=(
    os.getenv("RAZORPAY_KEY_ID"),
    os.getenv("RAZORPAY_KEY_SECRET")
))



@app.post("/api/create-order")
async def create_razorpay_order(request: CreateOrderRequest, db: Session = Depends(get_db)):
    try:
        customer_id = request.customer_id

        # Auto-create or reuse customer if no customer_id was passed but name/email were
        if not customer_id and request.customer_name and request.customer_email:
            existing = db.execute(text("""
                SELECT CustomerId FROM Customers WHERE Email = :email
            """), {"email": request.customer_email}).fetchone()

            if existing:
                customer_id = existing[0]
            else:
                result = db.execute(text("""
                    INSERT INTO Customers (Name, Email, Phone)
                    OUTPUT INSERTED.CustomerId
                    VALUES (:name, :email, :phone)
                """), {
                    "name": request.customer_name,
                    "email": request.customer_email,
                    "phone": request.customer_phone
                }).fetchone()
                customer_id = result[0]

        # Create Razorpay Order (used to open the checkout popup)
        order = razorpay_client.order.create({
            "amount": int(request.amount * 100),   # Convert to paise
            "currency": "INR",
            "payment_capture": "1"
        })

        razorpay_order_id = order['id']

        # Create Invoice record in our own DB
        invoice_id = None
        invoice_number = None

        if customer_id:
            result = db.execute(text("""
                EXEC sp_CreateInvoice 
                    @CustomerId = :customer_id,
                    @Amount = :amount,
                    @RazorpayOrderId = :order_id,
                    @Notes = :notes
            """), {
                "customer_id": customer_id,
                "amount": request.amount,
                "order_id": razorpay_order_id,
                "notes": request.notes
            }).fetchone()

            invoice_id = result[0]
            invoice_number = result[1]

        db.commit()

        # Also create a real Razorpay-hosted Invoice (separate from the Order)
        # This gives a proper short_url that can be viewed/shared as an actual invoice page.
        invoice_url = None
        try:
            razorpay_invoice = razorpay_client.invoice.create({
                "type": "invoice",
                "customer": {
                    "name": request.customer_name or "Customer",
                    "email": request.customer_email,
                    "contact": request.customer_phone
                },
                "line_items": [
                    {
                        "name": request.notes or "Payment",
                        "amount": int(request.amount * 100),
                        "currency": "INR",
                        "quantity": 1
                    }
                ],
                "notes": {
                    "internal_invoice_number": invoice_number or ""
                }
            })
            invoice_url = razorpay_invoice.get("short_url")
        except Exception as invoice_err:
            # Don't fail the whole order if the hosted invoice creation fails —
            # the checkout flow can still proceed without it.
            print("Razorpay invoice creation failed:", invoice_err)

        return {
            "success": True,
            "order_id": razorpay_order_id,
            "amount": int(request.amount * 100),
            "currency": "INR",
            "invoice_id": invoice_id,
            "invoice_number": invoice_number,
            "invoice_url": invoice_url
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/api/verify-payment")
async def verify_payment(request: VerifyPaymentRequest, db: Session = Depends(get_db)):
    try:
        # Verify Razorpay Signature
        params_dict = {
            'razorpay_order_id': request.razorpay_order_id,
            'razorpay_payment_id': request.razorpay_payment_id,
            'razorpay_signature': request.razorpay_signature
        }

        razorpay_client.utility.verify_payment_signature(params_dict)

        # Update payment status in database if invoice_id exists
        if request.invoice_id:
            db.execute(text("""
                EXEC sp_ProcessRazorpayPayment 
                    @InvoiceId = :invoice_id,
                    @RazorpayPaymentId = :payment_id,
                    @RazorpayOrderId = :order_id,
                    @Amount = 0,
                    @PaymentMethod = 'razorpay',
                    @PaymentStatus = 'captured',
                    @RazorpaySignature = :signature,
                    @RazorpayResponse = NULL
            """), {
                "invoice_id": request.invoice_id,
                "payment_id": request.razorpay_payment_id,
                "order_id": request.razorpay_order_id,
                "signature": request.razorpay_signature
            })
            db.commit()

        return {"success": True, "message": "Payment verified and recorded successfully"}

    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ====================== CREATE INVOICE + RAZORPAY ORDER ======================
@app.post("/api/invoices/create")
async def create_invoice(request: CreateInvoiceRequest, db: Session = Depends(get_db)):
    try:
        # Create Invoice using Stored Procedure
        result = db.execute(text("""
            EXEC sp_CreateInvoice 
                @CustomerId = :customer_id,
                @Amount = :amount,
                @RazorpayOrderId = NULL,
                @Notes = :notes
        """), {
            "customer_id": request.customer_id,
            "amount": float(request.amount),
            "notes": request.notes
        }).fetchone()

        invoice_id = result[0]
        invoice_number = result[1]

        # Create Razorpay Order
        order = razorpay_client.order.create({
            "amount": int(float(request.amount) * 100),   # Convert to paise
            "currency": "INR",
            "payment_capture": "1"
        })

        razorpay_order_id = order['id']

        # Update Invoice with Razorpay Order ID
        db.execute(text("""
            UPDATE Invoices 
            SET RazorpayOrderId = :order_id 
            WHERE InvoiceId = :invoice_id
        """), {"order_id": razorpay_order_id, "invoice_id": invoice_id})

        db.commit()

        return {
            "success": True,
            "invoice_id": invoice_id,
            "invoice_number": invoice_number,
            "razorpay_order_id": razorpay_order_id,
            "amount": float(request.amount)
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/payments/process")
async def process_razorpay_payment(request: PaymentProcessRequest, db: Session = Depends(get_db)):
    try:
        db.execute(text("""
            EXEC sp_ProcessRazorpayPayment 
                @InvoiceId = :invoice_id,
                @RazorpayPaymentId = :payment_id,
                @RazorpayOrderId = :order_id,
                @Amount = :amount,
                @PaymentMethod = :method,
                @PaymentStatus = :status,
                @RazorpaySignature = :signature,
                @RazorpayResponse = :response
        """), {
            "invoice_id": request.invoice_id,
            "payment_id": request.razorpay_payment_id,
            "order_id": request.razorpay_order_id,
            "amount": float(request.amount),
            "method": request.payment_method,
            "status": request.payment_status,
            "signature": request.razorpay_signature,
            "response": request.razorpay_response
        })

        db.commit()
        return {"success": True, "message": "Payment processed successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/invoices")
async def get_all_invoices(page: int = 1, page_size: int = 20, db: Session = Depends(get_db)):
    try:
        result = db.execute(text("""
            EXEC sp_GetAllInvoices 
                @PageNumber = :page,
                @PageSize = :page_size
        """), {"page": page, "page_size": page_size})
        
        data = [dict(row) for row in result.mappings()]
        return {"success": True, "data": data, "page": page, "page_size": page_size}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/invoices/details")
async def get_invoice_details(invoice_id: int = None, invoice_number: str = None, db: Session = Depends(get_db)):
    try:
        result = db.execute(text("""
            EXEC sp_GetInvoiceDetails 
                @InvoiceId = :invoice_id,
                @InvoiceNumber = :invoice_number
        """), {"invoice_id": invoice_id, "invoice_number": invoice_number})
        
        data = [dict(row) for row in result.mappings()]
        return {"success": True, "data": data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    
app.include_router(user.router)