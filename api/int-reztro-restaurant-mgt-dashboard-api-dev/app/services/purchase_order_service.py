from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def validate_purchase_order_payload(payload):

    if payload.inventory_id is None or payload.inventory_id <= 0:
        raise HTTPException(400, "Valid inventory_id is required")

    if not payload.po_no or payload.po_no.strip() == "":
        raise HTTPException(400, "PO number is required")

    if len(payload.po_no) > 50:
        raise HTTPException(400, "PO number cannot exceed 50 characters")

    if payload.price is None or payload.price < 0:
        raise HTTPException(400, "Price must be >= 0")

    if payload.quantity is None or payload.quantity <= 0:
        raise HTTPException(400, "Quantity must be > 0")

    if payload.delivery_progress < 0 or payload.delivery_progress > 100:
        raise HTTPException(400, "Delivery progress must be between 0 and 100")

    if payload.order_status not in ["Pending", "Shipped", "Delivered", "Cancelled"]:
        raise HTTPException(400, "Invalid order status")


def create_purchase_order_service(db, payload):
    try:

        validate_purchase_order_payload(payload)

        result = db.execute(
            text("""
                EXEC Reztro.AddPurchaseOrder
                    @inventory_id=:inventory_id,
                    @po_no=:po_no,
                    @vendor_supplier=:vendor_supplier,
                    @price=:price,
                    @quantity=:quantity,
                    @order_status=:order_status,
                    @delivery_progress=:delivery_progress,
                    @arrival_date=:arrival_date
            """),
            payload.model_dump()
        )

        order = result.mappings().first()

        db.commit()

        return order

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


def get_purchase_orders_service(db):
    try:

        result = db.execute(
            text("EXEC Reztro.GetPurchaseOrders")
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(500, str(e.orig))


def get_purchase_order_by_id_service(db, purchase_order_id: int):
    try:

        if purchase_order_id <= 0:
            raise HTTPException(400, "Invalid purchase_order_id")

        result = db.execute(
            text("""
                EXEC Reztro.GetPurchaseOrderById
                    @purchase_order_id=:purchase_order_id
            """),
            {"purchase_order_id": purchase_order_id}
        )

        order = result.mappings().first()

        if not order:
            raise HTTPException(404, "Purchase order not found")

        return order

    except HTTPException:
        raise

    except SQLAlchemyError as e:
        raise HTTPException(500, str(e.orig))


def update_purchase_order_service(db, purchase_order_id: int, payload):
    try:

        if purchase_order_id <= 0:
            raise HTTPException(400, "Invalid purchase_order_id")

        validate_purchase_order_payload(payload)

        params = payload.model_dump()
        params["purchase_order_id"] = purchase_order_id

        db.execute(
            text("""
                EXEC Reztro.UpdatePurchaseOrder
                    @purchase_order_id=:purchase_order_id,
                    @inventory_id=:inventory_id,
                    @po_no=:po_no,
                    @vendor_supplier=:vendor_supplier,
                    @price=:price,
                    @quantity=:quantity,
                    @order_status=:order_status,
                    @delivery_progress=:delivery_progress,
                    @arrival_date=:arrival_date
            """),
            params
        )

        db.commit()

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(400, str(e.orig))


def update_purchase_order_status_service(db, purchase_order_id: int, payload):
    try:

        if purchase_order_id <= 0:
            raise HTTPException(400, "Invalid purchase_order_id")

        if payload.order_status not in ["Pending", "Shipped", "Delivered", "Cancelled"]:
            raise HTTPException(400, "Invalid order status")

        if payload.delivery_progress < 0 or payload.delivery_progress > 100:
            raise HTTPException(400, "Delivery progress must be between 0 and 100")

        db.execute(
            text("""
                EXEC Reztro.UpdatePurchaseOrderStatus
                    @purchase_order_id=:purchase_order_id,
                    @order_status=:order_status,
                    @delivery_progress=:delivery_progress,
                    @arrival_date=:arrival_date
            """),
            {
                "purchase_order_id": purchase_order_id,
                **payload.model_dump()
            }
        )

        db.commit()

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(400, str(e.orig))


def mark_purchase_order_delivered_service(db, purchase_order_id: int, payload):
    try:

        if purchase_order_id <= 0:
            raise HTTPException(400, "Invalid purchase_order_id")

        result = db.execute(
            text("""
                EXEC Reztro.MarkPurchaseOrderDelivered
                    @purchase_order_id=:purchase_order_id,
                    @note=:note
            """),
            {
                "purchase_order_id": purchase_order_id,
                "note": payload.note
            }
        )

        data = result.mappings().first()

        db.commit()

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(400, str(e.orig))


def delete_purchase_order_service(db, purchase_order_id: int):
    try:

        if purchase_order_id <= 0:
            raise HTTPException(400, "Invalid purchase_order_id")

        db.execute(
            text("""
                EXEC Reztro.DeletePurchaseOrder
                    @purchase_order_id=:purchase_order_id
            """),
            {"purchase_order_id": purchase_order_id}
        )

        db.commit()

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(400, str(e.orig))


def get_purchase_order_summary_service(db):
    try:

        result = db.execute(
            text("EXEC Reztro.GetPurchaseOrderSummary")
        )

        return result.mappings().first()

    except SQLAlchemyError as e:
        raise HTTPException(500, str(e.orig))


def get_purchase_order_chart_service(db):
    try:

        result = db.execute(
            text("EXEC Reztro.GetPurchaseOrderDeliveryProgressChart")
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(500, str(e.orig))
    
