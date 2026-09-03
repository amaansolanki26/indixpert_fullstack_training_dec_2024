# app/schemas/invioce_schema.py

from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

# ==================== EXISTING SCHEMAS (Keep them) ====================
class CreateInvoiceRequest(BaseModel):
    customer_id: int
    amount: Decimal
    notes: Optional[str] = None

class PaymentProcessRequest(BaseModel):
    invoice_id: int
    razorpay_payment_id: str
    razorpay_order_id: str
    amount: Decimal
    payment_method: str
    payment_status: str
    razorpay_signature: Optional[str] = None
    razorpay_response: Optional[str] = None


# ==================== NEW RAZORPAY SCHEMAS ====================

class CreateOrderRequest(BaseModel):
    amount: Decimal                    # Amount in Rupees (e.g. 2999.00)
    customer_id: Optional[int] = None
    notes: Optional[str] = None
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None

    class Config:
        json_encoders = {
            Decimal: lambda v: float(v)
        }


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    invoice_id: Optional[int] = None