from fastapi import APIRouter, Depends

from app.db.database import get_db

from app.schemas.order_tracking_schemas import (
    OrderTrackingCreate,
    OrderTrackingUpdate,
    OrderStatusTrackingUpdate
)

from app.services.order_tracking_service import (
    add_order_tracking_service,
    get_order_tracking_service,
    get_order_tracking_by_order_id_service,
    get_latest_order_tracking_service,
    update_order_tracking_service,
    delete_order_tracking_service,
    update_order_status_with_tracking_service
)

router = APIRouter(
    prefix="/order-tracking",
    tags=["Order Tracking"]
)


# ADD TRACKING

@router.post("")
def add_order_tracking(
    payload: OrderTrackingCreate,
    db=Depends(get_db)
):

    data = add_order_tracking_service(
        db,
        payload
    )

    return {
        "success": True,
        "data": data
    }


# GET ALL TRACKING

@router.get("")
def get_order_tracking(
    db=Depends(get_db)
):

    data = get_order_tracking_service(db)

    return {
        "success": True,
        "data": data
    }


# GET TRACKING BY ORDER ID

@router.get("/order/{order_id}")
def get_order_tracking_by_order_id(
    order_id: int,
    db=Depends(get_db)
):

    data = get_order_tracking_by_order_id_service(
        db,
        order_id
    )

    return {
        "success": True,
        "data": data
    }


# GET LATEST TRACKING

@router.get("/order/{order_id}/latest")
def get_latest_order_tracking(
    order_id: int,
    db=Depends(get_db)
):

    data = get_latest_order_tracking_service(
        db,
        order_id
    )

    return {
        "success": True,
        "data": data
    }


# UPDATE TRACKING

@router.put("/{tracking_id}")
def update_order_tracking(
    tracking_id: int,
    payload: OrderTrackingUpdate,
    db=Depends(get_db)
):

    data = update_order_tracking_service(
        db,
        tracking_id,
        payload
    )

    return {
        "success": True,
        "data": data
    }


# DELETE TRACKING

@router.delete("/{tracking_id}")
def delete_order_tracking(
    tracking_id: int,
    db=Depends(get_db)
):

    delete_order_tracking_service(
        db,
        tracking_id
    )

    return {
        "success": True,
        "message": "Tracking deleted successfully"
    }


# UPDATE ORDER STATUS + TRACKING

@router.patch("/order/{order_id}/status")
def update_order_status_with_tracking(
    order_id: int,
    payload: OrderStatusTrackingUpdate,
    db=Depends(get_db)
):

    update_order_status_with_tracking_service(
        db,
        order_id,
        payload
    )

    return {
        "success": True,
        "message": "Order status updated successfully"
    }