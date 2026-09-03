from fastapi import APIRouter, Depends

from app.db.database import get_db

from app.schemas.order_schemas import (
    OrderCreate,
    OrderUpdate,
    OrderStatusUpdate,
    ApplyPromotionRequest
)

from app.schemas.order_item_schemas import (
    OrderItemCreate,
    OrderItemUpdate
)

from app.services.order_service import (
    create_order_service,
    get_orders_service,
    get_order_by_id_service,
    update_order_service,
    update_order_status_service,
    delete_order_service,
    

    add_order_item_service,
    get_order_items_service,
    get_order_items_by_order_id_service,
    get_order_item_by_id_service,
    update_order_item_service,
    delete_order_item_service,
    apply_promotion_service
)

router = APIRouter(
    tags=["Orders"]
)

# ORDERS

@router.post("/orders")
def create_order(
    payload: OrderCreate,
    db=Depends(get_db)
):

    order = create_order_service(
        db,
        payload
    )

    return {
        "success": True,
        "message": "Order created successfully",
        "order_id": order["order_id"]
    }


@router.get("/orders")
def get_orders(
    db=Depends(get_db)
):

    orders = get_orders_service(db)

    return {
        "success": True,
        "count": len(orders),
        "data": orders
    }


@router.get("/orders/{order_id}")
def get_order_by_id(
    order_id: int,
    db=Depends(get_db)
):

    order = get_order_by_id_service(
        db,
        order_id
    )

    return {
        "success": True,
        "data": order
    }


@router.put("/orders/{order_id}")
def update_order(
    order_id: int,
    payload: OrderUpdate,
    db=Depends(get_db)
):

    update_order_service(
        db,
        order_id,
        payload
    )

    return {
        "success": True,
        "message": "Order updated successfully"
    }


@router.patch("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db=Depends(get_db)
):

    update_order_status_service(
        db,
        order_id,
        payload
    )

    return {
        "success": True,
        "message": "Order status updated successfully"
    }


@router.delete("/orders/{order_id}")
def delete_order(
    order_id: int,
    db=Depends(get_db)
):

    delete_order_service(
        db,
        order_id
    )

    return {
        "success": True,
        "message": "Order cancelled successfully"
    }


# ORDER ITEMS

@router.post("/order-items")
def add_order_item(
    payload: OrderItemCreate,
    db=Depends(get_db)
):

    add_order_item_service(
        db,
        payload
    )

    return {
        "success": True,
        "message": "Order item added successfully"
    }


@router.get("/order-items")
def get_order_items(
    db=Depends(get_db)
):

    items = get_order_items_service(db)

    return {
        "success": True,
        "count": len(items),
        "data": items
    }


@router.get("/orders/{order_id}/items")
def get_order_items_by_order_id(
    order_id: int,
    db=Depends(get_db)
):

    items = get_order_items_by_order_id_service(
        db,
        order_id
    )

    return {
        "success": True,
        "count": len(items),
        "data": items
    }


@router.get("/order-items/{order_item_id}")
def get_order_item_by_id(
    order_item_id: int,
    db=Depends(get_db)
):

    item = get_order_item_by_id_service(
        db,
        order_item_id
    )

    return {
        "success": True,
        "data": item
    }


@router.put("/order-items/{order_item_id}")
def update_order_item(
    order_item_id: int,
    payload: OrderItemUpdate,
    db=Depends(get_db)
):

    update_order_item_service(
        db,
        order_item_id,
        payload
    )

    return {
        "success": True,
        "message": "Order item updated successfully"
    }


@router.delete("/order-items/{order_item_id}")
def delete_order_item(
    order_item_id: int,
    db=Depends(get_db)
):

    delete_order_item_service(
        db,
        order_item_id
    )

    return {
        "success": True,
        "message": "Order item deleted successfully"
    }

@router.post("/orders/apply-promotion")
def apply_promotion(
    payload: ApplyPromotionRequest,
    db=Depends(get_db)
):

    result = apply_promotion_service(
        db,
        payload
    )

    return {
        "success": True,
        "message": "Promotion applied successfully",
        "data": result
    }