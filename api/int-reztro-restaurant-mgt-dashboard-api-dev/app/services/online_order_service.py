from fastapi import (
    HTTPException,
    status
)

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def get_online_orders_service(
    db
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetOnlineOrderDetails
            """)
        )

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def get_online_order_by_id_service(
    db,
    online_order_id
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetOnlineOrderDetailsById
                    @online_order_id=:online_order_id
            """),
            {
                "online_order_id": online_order_id
            }
        )

        online_order = result.mappings().first()

        if not online_order:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Online order not found"
            )

        return online_order

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def get_online_order_by_order_id_service(
    db,
    order_id
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetOnlineOrderDetailsByOrderId
                    @order_id=:order_id
            """),
            {
                "order_id": order_id
            }
        )

        online_order = result.mappings().first()

        if not online_order:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Online order not found"
            )

        return online_order

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def update_online_order_service(
    db,
    online_order_id,
    payload
):

    try:

        db.execute(
            text("""
                EXEC Reztro.UpdateOnlineOrderDetails
                    @online_order_id=:online_order_id,
                    @delivery_address=:delivery_address,
                    @city=:city,
                    @state=:state,
                    @postal_code=:postal_code,
                    @contact_person=:contact_person,
                    @contact_phone=:contact_phone,
                    @contact_email=:contact_email,
                    @delivery_notes=:delivery_notes
            """),
            {
                "online_order_id": online_order_id,
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


def delete_online_order_service(
    db,
    online_order_id
):

    try:

        db.execute(
            text("""
                EXEC Reztro.DeleteOnlineOrderDetails
                    @online_order_id=:online_order_id
            """),
            {
                "online_order_id": online_order_id
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )
    
def assign_driver_service(
    db,
    online_id,
    driver_id
):

    try:

        db.execute(
            text("""
                EXEC Reztro.AssignDriverToOnlineOrder
                    @online_id=:online_id,
                    @driver_id=:driver_id
            """),
            {
                "online_id": online_id,
                "driver_id": driver_id
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )
        
def auto_assign_driver_service(
    db,
    online_id
):

    try:

        db.execute(
            text("""
                EXEC Reztro.AutoAssignDriverToOnlineOrder
                    @online_id=:online_id
            """),
            {
                "online_id": online_id
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )
def get_online_order_driver_details_service(
    db,
    order_id
):
    result = db.execute(
        text("""
            EXEC Reztro.GetOnlineOrderDriverDetails
                @order_id=:order_id
        """),
        {
            "order_id": order_id
        }
    )

    return result.mappings().first()