from fastapi import (
    APIRouter,
    Depends
)

from app.db.database import get_db

from app.schemas.takeaway_order_schemas import (
    TakeawayOrderUpdate
)

from app.services.takeaway_order_service import (
    get_takeaway_orders_service,
    get_takeaway_by_id_service,
    get_takeaway_by_order_id_service,
    update_takeaway_service,
    delete_takeaway_service
)

router = APIRouter(
    prefix="/takeaway-orders",
    tags=["Takeaway Orders"]
)


@router.get("")
def get_takeaway_orders(
    db=Depends(get_db)
):

    data = get_takeaway_orders_service(db)

    return {
        "success": True,
        "count": len(data),
        "data": data
    }


@router.get("/{takeaway_id}")
def get_takeaway_by_id(
    takeaway_id: int,
    db=Depends(get_db)
):

    data = get_takeaway_by_id_service(
        db,
        takeaway_id
    )

    return {
        "success": True,
        "data": data
    }


@router.get("/order/{order_id}")
def get_takeaway_by_order_id(
    order_id: int,
    db=Depends(get_db)
):

    data = get_takeaway_by_order_id_service(
        db,
        order_id
    )

    return {
        "success": True,
        "data": data
    }


@router.put("/{takeaway_id}")
def update_takeaway(
    takeaway_id: int,
    payload: TakeawayOrderUpdate,
    db=Depends(get_db)
):

    update_takeaway_service(
        db,
        takeaway_id,
        payload
    )

    return {
        "success": True,
        "message": "Takeaway details updated successfully"
    }


@router.delete("/{takeaway_id}")
def delete_takeaway(
    takeaway_id: int,
    db=Depends(get_db)
):

    delete_takeaway_service(
        db,
        takeaway_id
    )

    return {
        "success": True,
        "message": "Takeaway details deleted successfully"
    }