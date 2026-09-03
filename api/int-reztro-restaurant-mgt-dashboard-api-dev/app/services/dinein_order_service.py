from fastapi import (
    HTTPException,
    status
)

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def get_dine_in_orders_service(
    db
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetDineInOrderDetails
            """)
        )

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def get_dine_in_by_id_service(
    db,
    dine_in_id
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetDineInOrderDetailsById
                    @dine_in_id=:dine_in_id
            """),
            {
                "dine_in_id": dine_in_id
            }
        )

        dine_in = result.mappings().first()

        if not dine_in:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Dine-In order not found"
            )

        return dine_in

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def get_dine_in_by_order_id_service(
    db,
    order_id
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetDineInOrderDetailsByOrderId
                    @order_id=:order_id
            """),
            {
                "order_id": order_id
            }
        )

        return result.mappings().first()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def update_dine_in_service(
    db,
    dine_in_id,
    payload
):

    try:

        db.execute(
            text("""
                EXEC Reztro.UpdateDineInOrderDetails
                    @dine_in_id=:dine_in_id,
                    @table_no=:table_no,
                    @guest_count=:guest_count
            """),
            {
                "dine_in_id": dine_in_id,
                **payload.model_dump()
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def delete_dine_in_service(
    db,
    dine_in_id
):

    try:

        db.execute(
            text("""
                EXEC Reztro.DeleteDineInOrderDetails
                    @dine_in_id=:dine_in_id
            """),
            {
                "dine_in_id": dine_in_id
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )