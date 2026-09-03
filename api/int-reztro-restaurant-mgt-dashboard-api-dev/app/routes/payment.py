from fastapi import (
    APIRouter,
    Depends
)

from app.db.database import get_db

from app.schemas.payment_schemas import (
    PaymentCreate,
    PaymentUpdate,
    PaymentStatusUpdate
)

from app.services.payment_service import (
    get_payments_service,
    get_payment_by_id_service,
    get_payment_by_order_id_service,
    update_payment_service,
    update_payment_status_service,
    delete_payment_service
)

router = APIRouter(
    tags=["Payments"]
)


@router.get("/payments")
def get_payments(
    db=Depends(get_db)
):

    payments = get_payments_service(db)

    return {
        "success": True,
        "count": len(payments),
        "data": payments
    }


@router.get("/payments/{payment_id}")
def get_payment_by_id(
    payment_id: int,
    db=Depends(get_db)
):

    payment = get_payment_by_id_service(
        db,
        payment_id
    )

    return {
        "success": True,
        "data": payment
    }


@router.get("/orders/{order_id}/payment")
def get_payment_by_order_id(
    order_id: int,
    db=Depends(get_db)
):

    payment = get_payment_by_order_id_service(
        db,
        order_id
    )

    return {
        "success": True,
        "data": payment
    }


@router.put("/payments/{payment_id}")
def update_payment(
    payment_id: int,
    payload: PaymentUpdate,
    db=Depends(get_db)
):

    payment = update_payment_service(
        db,
        payment_id,
        payload
    )

    return {
        "success": True,
        "message": "Payment updated successfully",
        "data": payment
    }


@router.patch("/payments/{payment_id}/status")
def update_payment_status(
    payment_id: int,
    payload: PaymentStatusUpdate,
    db=Depends(get_db)
):

    payment = update_payment_status_service(
        db,
        payment_id,
        payload
    )

    return {
        "success": True,
        "message": "Payment status updated successfully",
        "data": payment
    }


@router.delete("/payments/{payment_id}")
def delete_payment(
    payment_id: int,
    db=Depends(get_db)
):

    delete_payment_service(
        db,
        payment_id
    )

    return {
        "success": True,
        "message": "Payment deleted successfully"
    }