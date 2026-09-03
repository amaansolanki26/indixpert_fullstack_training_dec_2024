from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def flatten_inventory_payload(payload):
    data = payload if isinstance(payload, dict) else payload.model_dump()

    if "category" in data and data["category"]:
        data["inventory_category_id"] = data["category"]["inventory_category_id"]
        del data["category"]

    if "stock" in data and data["stock"]:
        stock = data["stock"]
        data.update(stock)
        del data["stock"]

    return data


def add_inventory_item_service(db, payload):
    try:
        data = flatten_inventory_payload(payload)

        result = db.execute(
            text("""
                EXEC Reztro.AddInventoryItem
                    @inventory_category_id=:inventory_category_id,
                    @item_name=:item_name,
                    @image_url=:image_url,
                    @stock_status=:stock_status,
                    @qty_in_stock=:qty_in_stock,
                    @qty_in_reorder=:qty_in_reorder,
                    @unit=:unit
            """),
            data
        )

        rows = result.mappings().all()
        data = rows[0] if rows else None

        db.commit()

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


def get_inventory_items_service(db):
    try:
        result = db.execute(text("EXEC Reztro.GetInventoryItems"))
        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=str(getattr(e, "orig", e))
        )


def get_inventory_item_by_id_service(db, inventory_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetInventoryItemById
                    @inventory_id=:inventory_id
            """),
            {"inventory_id": inventory_id}
        )

        rows = result.mappings().all()
        return rows[0] if rows else None

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


def update_inventory_item_service(db, inventory_id: int, payload):
    try:
        data = flatten_inventory_payload(payload)
        data["inventory_id"] = inventory_id

        result = db.execute(
            text("""
                EXEC Reztro.UpdateInventoryItem
                    @inventory_id=:inventory_id,
                    @inventory_category_id=:inventory_category_id,
                    @item_name=:item_name,
                    @image_url=:image_url,
                    @stock_status=:stock_status,
                    @qty_in_stock=:qty_in_stock,
                    @qty_in_reorder=:qty_in_reorder,
                    @unit=:unit
            """),
            data
        )

        rows = result.mappings().all()
        data = rows[0] if rows else None

        db.commit()

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


def update_inventory_stock_service(db, inventory_id: int, payload):
    try:
        data = payload.model_dump()
        data["inventory_id"] = inventory_id

        result = db.execute(
            text("""
                EXEC Reztro.UpdateInventoryStock
                    @inventory_id=:inventory_id,
                    @qty_in_stock=:qty_in_stock,
                    @qty_in_reorder=:qty_in_reorder
            """),
            data
        )

        rows = result.mappings().all()
        data = rows[0] if rows else None

        db.commit()

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


def delete_inventory_item_service(db, inventory_id: int):
    try:
        db.execute(
            text("""
                EXEC Reztro.DeleteInventoryItem
                    @inventory_id=:inventory_id
            """),
            {"inventory_id": inventory_id}
        )

        db.commit()

        return {"inventory_id": inventory_id}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


def restore_inventory_item_service(db, inventory_id: int):
    try:
        db.execute(
            text("""
                EXEC Reztro.RestoreInventoryItem
                    @inventory_id=:inventory_id
            """),
            {"inventory_id": inventory_id}
        )

        db.commit()

        return {"inventory_id": inventory_id}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )

def get_low_stock_inventory_service(db):
    try:
        result = db.execute(text("EXEC Reztro.GetLowStockInventoryItems"))
        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


def get_inventory_summary_service(db):
    try:
        result = db.execute(text("EXEC Reztro.GetInventoryStockSummary"))

        rows = result.mappings().all()
        return rows[0] if rows else None

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )