from fastapi import (
    HTTPException,
    status
)

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

# GET ALL PAYMENTS

def get_payments_service(
    db
):

    try:

        result = db.execute(
            text("EXEC Reztro.GetPayments")
        )

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


# GET PAYMENT BY ID

def get_payment_by_id_service(
    db,
    payment_id
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetPaymentById
                    @payment_id=:payment_id
            """),
            {
                "payment_id": payment_id
            }
        )

        payment = result.mappings().first()

        if not payment:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )

        return payment

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


# GET PAYMENT BY ORDER ID

def get_payment_by_order_id_service(
    db,
    order_id
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetPaymentByOrderId
                    @order_id=:order_id
            """),
            {
                "order_id": order_id
            }
        )

        payment = result.mappings().first()

        if not payment:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )

        return payment

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


# UPDATE PAYMENT

def update_payment_service(
    db,
    payment_id,
    payload
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.UpdatePayment
                    @payment_id=:payment_id,
                    @payment_method=:payment_method,
                    @payment_status=:payment_status,
                    @transaction_id=:transaction_id
            """),
            {
                "payment_id": payment_id,
                **payload.model_dump()
            }
        )

        payment = result.mappings().first()

        if not payment:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )

        db.commit()

        return payment

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


# UPDATE PAYMENT STATUS

def update_payment_status_service(
    db,
    payment_id,
    payload
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.UpdatePaymentStatus
                    @payment_id=:payment_id,
                    @payment_status=:payment_status,
                    @transaction_id=:transaction_id
            """),
            {
                "payment_id": payment_id,
                **payload.model_dump()
            }
        )

        payment = result.mappings().first()

        if not payment:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )

        db.commit()

        return payment

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )

# DELETE PAYMENT

def delete_payment_service(
    db,
    payment_id
):

    try:

        db.execute(
            text("""
                EXEC Reztro.DeletePayment
                    @payment_id=:payment_id
            """),
            {
                "payment_id": payment_id
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )