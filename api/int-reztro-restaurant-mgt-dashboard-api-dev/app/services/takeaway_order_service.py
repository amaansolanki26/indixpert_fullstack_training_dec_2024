from fastapi import (
    HTTPException,
    status
)

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def get_takeaway_orders_service(
    db
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetTakeawayOrderDetails
            """)
        )

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def get_takeaway_by_id_service(
    db,
    takeaway_id
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetTakeawayOrderDetailsById
                    @takeaway_id=:takeaway_id
            """),
            {
                "takeaway_id": takeaway_id
            }
        )

        takeaway = result.mappings().first()

        if not takeaway:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Takeaway order not found"
            )

        return takeaway

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def get_takeaway_by_order_id_service(
    db,
    order_id
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetTakeawayOrderDetailsByOrderId
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


def update_takeaway_service(
    db,
    takeaway_id,
    payload
):

    try:

        db.execute(
            text("""
                EXEC Reztro.UpdateTakeawayOrderDetails
                    @takeaway_id=:takeaway_id,
                    @pickup_time=:pickup_time,
                    @pickup_code=:pickup_code
            """),
            {
                "takeaway_id": takeaway_id,
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


def delete_takeaway_service(
    db,
    takeaway_id
):

    try:

        db.execute(
            text("""
                EXEC Reztro.DeleteTakeawayOrderDetails
                    @takeaway_id=:takeaway_id
            """),
            {
                "takeaway_id": takeaway_id
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )