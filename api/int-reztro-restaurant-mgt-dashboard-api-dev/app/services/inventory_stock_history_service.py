from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def safe_fetch_one(result):
    try:
        rows = result.mappings().all()
        return rows[0] if rows else None
    except Exception:
        return None  


def safe_fetch_all(result):
    try:
        return result.mappings().all()
    except Exception:
        return [] 


# 🔹 ADD STOCK MOVEMENT
def add_stock_movement_service(db, payload):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.AddInventoryStockMovement
                    @inventory_id=:inventory_id,
                    @movement_type=:movement_type,
                    @quantity=:quantity,
                    @note=:note
            """),
            payload.model_dump()
        )

        data = safe_fetch_one(result)

        db.commit()

        if not data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No response from procedure"
            )

        if data.get("success") == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=data.get("message")
            )

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET ALL STOCK HISTORY
def get_stock_history_service(db):
    try:
        result = db.execute(
            text("EXEC Reztro.GetInventoryStockHistory")
        )

        return safe_fetch_all(result)

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET BY ID
def get_stock_history_by_id_service(db, stock_history_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetInventoryStockHistoryById
                    @stock_history_id=:stock_history_id
            """),
            {"stock_history_id": stock_history_id}
        )

        data = safe_fetch_one(result)

        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Stock history not found"
            )

        # Handle SP validation response
        if "success" in data and data.get("success") == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=data.get("message")
            )

        return data

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET BY INVENTORY ID
def get_stock_history_by_inventory_service(db, inventory_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetStockHistoryByInventoryId
                    @inventory_id=:inventory_id
            """),
            {"inventory_id": inventory_id}
        )

        data = safe_fetch_all(result)

        # Handle SP validation response
        if data and "success" in data[0] and data[0].get("success") == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=data[0].get("message")
            )

        return data

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET SUMMARY
def get_stock_summary_service(db):
    try:
        result = db.execute(
            text("EXEC Reztro.GetStockMovementSummary")
        )

        return safe_fetch_all(result)

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET CHART DATA
def get_stock_chart_service(db):
    try:
        result = db.execute(
            text("EXEC Reztro.GetStockMovementChart")
        )

        return safe_fetch_all(result)

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 DELETE STOCK HISTORY
def delete_stock_history_service(db, stock_history_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.DeleteInventoryStockHistory
                    @stock_history_id=:stock_history_id
            """),
            {"stock_history_id": stock_history_id}
        )

        data = safe_fetch_one(result)

        db.commit()

        if not data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Delete failed"
            )

        if data.get("success") == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=data.get("message")
            )

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(getattr(e, "orig", e))
        )

# 🔹 RESTORE STOCK HISTORY
def restore_stock_history_service(db, stock_history_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.RestoreInventoryStockHistory
                    @stock_history_id=:stock_history_id
            """),
            {"stock_history_id": stock_history_id}
        )

        data = safe_fetch_one(result)

        db.commit()

        if not data:
            raise HTTPException(
                status_code=400,
                detail="Restore failed"
            )

        if data.get("success") == 0:
            raise HTTPException(
                status_code=400,
                detail=data.get("message")
            )

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )