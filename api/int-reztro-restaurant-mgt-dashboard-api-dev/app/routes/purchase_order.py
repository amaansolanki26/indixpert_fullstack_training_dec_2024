from fastapi import APIRouter, Depends

from app.db.database import get_db

from app.schemas.purchase_order_schemas import (
    PurchaseOrderCreate,
    PurchaseOrderUpdate,
    PurchaseOrderStatusUpdate,
    PurchaseOrderDeliver
)

from app.services.purchase_order_service import (
    create_purchase_order_service,
    get_purchase_orders_service,
    get_purchase_order_by_id_service,
    update_purchase_order_service,
    update_purchase_order_status_service,
    mark_purchase_order_delivered_service,
    delete_purchase_order_service,
    get_purchase_order_summary_service,
    get_purchase_order_chart_service
)

router = APIRouter(
    prefix="/purchase-orders",
    tags=["Purchase Orders"]
)


@router.post("")
def create_purchase_order(
    payload: PurchaseOrderCreate,
    db=Depends(get_db)
):

    order = create_purchase_order_service(db, payload)

    return {
        "success": True,
        "message": "Purchase order created successfully",
        "data": order
    }


@router.get("")
def get_purchase_orders(
    db=Depends(get_db)
):

    data = get_purchase_orders_service(db)

    return {
        "success": True,
        "count": len(data),
        "data": data
    }


@router.get("/summary")
def get_purchase_order_summary(
    db=Depends(get_db)
):

    data = get_purchase_order_summary_service(db)

    return {
        "success": True,
        "data": data
    }


@router.get("/chart")
def get_purchase_order_chart(
    db=Depends(get_db)
):

    data = get_purchase_order_chart_service(db)

    return {
        "success": True,
        "data": data
    }


@router.patch("/{purchase_order_id}/status")
def update_purchase_order_status(
    purchase_order_id: int,
    payload: PurchaseOrderStatusUpdate,
    db=Depends(get_db)
):

    update_purchase_order_status_service(
        db,
        purchase_order_id,
        payload
    )

    return {
        "success": True,
        "message": "Status updated successfully"
    }


@router.patch("/{purchase_order_id}/deliver")
def mark_purchase_order_delivered(
    purchase_order_id: int,
    payload: PurchaseOrderDeliver,
    db=Depends(get_db)
):
    data = mark_purchase_order_delivered_service(db, purchase_order_id, payload)
    return {
        "success": True,
        "message": "Purchase order marked as delivered",
        "data": data
    }


@router.get("/{purchase_order_id}")
def get_purchase_order_by_id(
    purchase_order_id: int,
    db=Depends(get_db)
):

    order = get_purchase_order_by_id_service(
        db,
        purchase_order_id
    )

    return {
        "success": True,
        "data": order
    }


@router.put("/{purchase_order_id}")
def update_purchase_order(
    purchase_order_id: int,
    payload: PurchaseOrderUpdate,
    db=Depends(get_db)
):

    update_purchase_order_service(
        db,
        purchase_order_id,
        payload
    )

    return {
        "success": True,
        "message": "Purchase order updated successfully"
    }


@router.delete("/{purchase_order_id}")
def delete_purchase_order(
    purchase_order_id: int,
    db=Depends(get_db)
):

    delete_purchase_order_service(
        db,
        purchase_order_id
    )

    return {
        "success": True,
        "message": "Purchase order deleted successfully"
    }