from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


# ADD ORDER TRACKING

def add_order_tracking_service(
    db,
    payload
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.AddOrderTracking
                    @order_id=:order_id,
                    @tracking_status=:tracking_status,
                    @tracking_note=:tracking_note,
                    @sort_order=:sort_order
            """),
            {
                "order_id": payload.order_id,
                "tracking_status": payload.tracking_status,
                "tracking_note": payload.tracking_note,
                "sort_order": payload.sort_order
            }
        )

        tracking = result.mappings().first()

        db.commit()

        return tracking

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


# GET ALL TRACKING

def get_order_tracking_service(db):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetOrderTracking
            """)
        )

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


# GET TRACKING BY ORDER ID

def get_order_tracking_by_order_id_service(
    db,
    order_id
):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetOrderTrackingByOrderId
                    @order_id=:order_id
            """),
            {
                "order_id": order_id
            }
        )
 
        tracking = result.mappings().all()
 
        if not tracking:
            return []
 
        return [dict(row) for row in tracking]
 
    except SQLAlchemyError as e:
        db.rollback()
 
        error_message = str(e.orig)
 
        if "No active tracking records found" in error_message:
            return []
 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_message
        )

# GET LATEST TRACKING

def get_latest_order_tracking_service(
    db,
    order_id
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetLatestOrderTracking
                    @order_id=:order_id
            """),
            {
                "order_id": order_id
            }
        )

        tracking = result.mappings().first()

        if not tracking:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tracking not found"
            )

        return tracking

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


# UPDATE TRACKING

def update_order_tracking_service(
    db,
    tracking_id,
    payload
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.UpdateOrderTracking
                    @tracking_id=:tracking_id,
                    @tracking_status=:tracking_status,
                    @tracking_note=:tracking_note,
                    @sort_order=:sort_order
            """),
            {
                "tracking_id": tracking_id,
                "tracking_status": payload.tracking_status,
                "tracking_note": payload.tracking_note,
                "sort_order": payload.sort_order
            }
        )

        tracking = result.mappings().first()

        db.commit()

        return tracking

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


# DELETE TRACKING

def delete_order_tracking_service(
    db,
    tracking_id
):

    try:

        db.execute(
            text("""
                EXEC Reztro.DeleteOrderTracking
                    @tracking_id=:tracking_id
            """),
            {
                "tracking_id": tracking_id
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


# UPDATE ORDER STATUS WITH TRACKING

def update_order_status_with_tracking_service(
    db,
    order_id,
    payload
):

    try:

        db.execute(
            text("""
                EXEC Reztro.UpdateOrderStatusWithTracking
                    @order_id=:order_id,
                    @order_status=:order_status,
                    @tracking_note=:tracking_note
            """),
            {
                "order_id": order_id,
                "order_status": payload.order_status,
                "tracking_note": payload.tracking_note
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )