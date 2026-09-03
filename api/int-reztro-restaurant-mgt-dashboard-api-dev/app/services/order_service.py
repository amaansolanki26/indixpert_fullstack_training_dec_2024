from fastapi import HTTPException, status

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta

# ORDERS


def create_order_service(db, payload):

    try:

        # CREATE ORDER

        result = db.execute(
            text("""
                EXEC Reztro.CreateOrder
                    @customer_id=:customer_id,
                    @order_type=:order_type
            """),
            {"customer_id": payload.customer_id, "order_type": payload.order_type},
        )

        order = result.mappings().first()

        if not order:

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create order",
            )

        order_id = order["order_id"]

        # INITIAL ORDER TRACKING FOR ONLINE ORDER

        if payload.order_type == "Online":

            db.execute(
                text("""
                    EXEC Reztro.AddOrderTracking
                        @order_id=:order_id,
                        @tracking_status=:tracking_status,
                        @tracking_note=:tracking_note,
                        @sort_order=:sort_order
                """),
                {
                    "order_id": order_id,
                    "tracking_status": "Order Placed",
                    "tracking_note": "Order has been placed successfully",
                    "sort_order": 1,
                },
            )

        # ORDER ITEMS

        if payload.items:

            for item in payload.items:

                db.execute(
                    text("""
                        EXEC Reztro.AddOrderItem
                            @order_id=:order_id,
                            @menu_id=:menu_id,
                            @quantity=:quantity,
                            @notes=:notes
                    """),
                    {
                        "order_id": order_id,
                        "menu_id": item.menu_id,
                        "quantity": item.quantity,
                        "notes": item.notes,
                    },
                )

        # DINE IN DETAILS

        if payload.order_type == "Dine-In" and payload.dine_in_details:

            db.execute(
                text("""
                    EXEC Reztro.AddDineInOrderDetails
                        @order_id=:order_id,
                        @table_no=:table_no,
                        @guest_count=:guest_count
                """),
                {
                    "order_id": order_id,
                    "table_no": payload.dine_in_details.table_no,
                    "guest_count": payload.dine_in_details.guest_count,
                },
            )

        # TAKEAWAY DETAILS

        if payload.order_type == "Takeaway" and payload.takeaway_details:

            db.execute(
                text("""
                    EXEC Reztro.AddTakeawayOrderDetails
                        @order_id=:order_id,
                        @pickup_time=:pickup_time,
                        @pickup_code=:pickup_code
                """),
                {
                    "order_id": order_id,
                    "pickup_time": payload.takeaway_details.pickup_time,
                    "pickup_code": payload.takeaway_details.pickup_code,
                },
            )

        # ONLINE DETAILS
        if payload.order_type == "Online" and payload.online_details:

            estimated_arrival_time = datetime.now() + timedelta(minutes=30)

            result = db.execute(
                text("""
                    EXEC Reztro.AddOnlineOrderDetails
                        @order_id=:order_id,
                        @delivery_address=:delivery_address,
                        @delivery_latitude=:delivery_latitude,
                        @delivery_longitude=:delivery_longitude,
                        @restaurant_address=:restaurant_address,
                        @restaurant_latitude=:restaurant_latitude,
                        @restaurant_longitude=:restaurant_longitude,
                        @delivery_time=:delivery_time,
                        @estimated_arrival_time=:estimated_arrival_time
                """),
                {
                    "order_id": order_id,
                    "delivery_address": payload.online_details.delivery_address,
                    "delivery_latitude": payload.online_details.delivery_latitude,
                    "delivery_longitude": payload.online_details.delivery_longitude,
                    "restaurant_address": payload.online_details.restaurant_address,
                    "restaurant_latitude": payload.online_details.restaurant_latitude,
                    "restaurant_longitude": payload.online_details.restaurant_longitude,
                    "delivery_time": payload.online_details.delivery_time,
                    "estimated_arrival_time": estimated_arrival_time,
                },
            )

            online_order = result.mappings().first()

            if online_order:

                db.execute(
                    text("""
                        EXEC Reztro.AutoAssignDriverToOnlineOrder
                            @online_id=:online_id
                    """),
                    {"online_id": online_order["online_id"]},
                )

        # PAYMENT

        if payload.payment:

            db.execute(
                text("""
        EXEC Reztro.AddPayment
            @order_id=:order_id,
            @payment_method=:payment_method,
            @payment_status=:payment_status,
            @transaction_id=:transaction_id
    """),
                {
                    "order_id": order_id,
                    "payment_method": payload.payment.payment_method,
                    "payment_status": payload.payment.payment_status,
                    "transaction_id": payload.payment.transaction_id,
                },
            )

        db.commit()

        return order

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e.orig)
        )


def get_orders_service(db):

    try:

        result = db.execute(text("EXEC Reztro.GetOrders"))

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e.orig)
        )


def get_order_by_id_service(db, order_id: int):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetOrderById
                    @order_id=:order_id
            """),
            {"order_id": order_id},
        )

        order = result.mappings().first()

        if not order:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
            )

        return order

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e.orig)
        )


def update_order_service(db, order_id, payload):

    try:

        db.execute(
            text("""
                EXEC Reztro.UpdateOrder
                    @order_id=:order_id,
                    @customer_id=:customer_id,
                    @order_type=:order_type,
                    @order_status=:order_status
            """),
            {
                "order_id": order_id,
                "customer_id": payload.customer_id,
                "order_type": payload.order_type,
                "order_status": payload.order_status,
            },
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e.orig)
        )


def update_order_status_service(db, order_id, payload):

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
                "tracking_note": payload.tracking_note,
            },
        )

        # RELEASE RESOURCES WHEN ORDER IS COMPLETED/CANCELLED

        if payload.order_status in ["Completed", "Cancelled"]:

            # RELEASE DRIVER (ONLINE ORDER)

            result = db.execute(
                text("""
                    EXEC Reztro.GetOnlineOrderDetailsByOrderId
                        @order_id=:order_id
                """),
                {"order_id": order_id},
            )

            online_order = result.mappings().first()

            if online_order and online_order["driver_id"]:

                db.execute(
                    text("""
                        EXEC Reztro.ReleaseDriverFromOnlineOrder
                            @driver_id=:driver_id
                    """),
                    {"driver_id": online_order["driver_id"]},
                )

            # RELEASE TABLE (DINE-IN ORDER)

            db.execute(
                text("""
                    EXEC Reztro.ReleaseDineInTable
                        @order_id=:order_id
                """),
                {"order_id": order_id},
            )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e.orig)
        )


def delete_order_service(db, order_id):

    try:

        db.execute(
            text("""
                EXEC Reztro.DeleteOrder
                    @order_id=:order_id
            """),
            {"order_id": order_id},
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e.orig)
        )


# ORDER ITEMS


def add_order_item_service(db, payload):

    try:

        db.execute(
            text("""
                EXEC Reztro.AddOrderItem
                    @order_id=:order_id,
                    @menu_id=:menu_id,
                    @quantity=:quantity,
                    @notes=:notes
            """),
            payload.model_dump(),
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e.orig)
        )


def get_order_items_service(db):

    try:

        result = db.execute(text("""
                EXEC Reztro.GetOrderItems
            """))

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e.orig)
        )


def get_order_items_by_order_id_service(db, order_id):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetOrderItemsByOrderId
                    @order_id=:order_id
            """),
            {"order_id": order_id},
        )

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e.orig)
        )


def get_order_item_by_id_service(db, order_item_id):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetOrderItemById
                    @order_item_id=:order_item_id
            """),
            {"order_item_id": order_item_id},
        )

        item = result.mappings().first()

        if not item:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Order item not found"
            )

        return item

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e.orig)
        )


def update_order_item_service(db, order_item_id, payload):

    try:

        db.execute(
            text("""
                EXEC Reztro.UpdateOrderItem
                    @order_item_id=:order_item_id,
                    @menu_id=:menu_id,
                    @quantity=:quantity,
                    @notes=:notes
            """),
            {
                "order_item_id": order_item_id,
                "menu_id": payload.menu_id,
                "quantity": payload.quantity,
                "notes": payload.notes,
            },
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e.orig)
        )


def delete_order_item_service(db, order_item_id):

    try:

        db.execute(
            text("""
                EXEC Reztro.DeleteOrderItem
                    @order_item_id=:order_item_id
            """),
            {"order_item_id": order_item_id},
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e.orig)
        )


def apply_promotion_service(db, payload):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.ApplyPromotionToOrder
                    @order_id=:order_id,
                    @promotion_code=:promotion_code
            """),
            payload.model_dump(),
        )

        promotion = result.mappings().first()

        db.commit()

        return promotion

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
