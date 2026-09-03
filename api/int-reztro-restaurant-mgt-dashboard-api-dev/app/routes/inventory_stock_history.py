from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.inventory_stock_history_schemas import (
    StockMovementCreate
)

from app.services.inventory_stock_history_service import (
    add_stock_movement_service,
    get_stock_history_service,
    get_stock_history_by_id_service,
    get_stock_history_by_inventory_service,
    get_stock_summary_service,
    get_stock_chart_service,
    delete_stock_history_service,
    restore_stock_history_service
)

router = APIRouter(
    prefix="/inventory-stock-history",
    tags=["Inventory Stock History"]
)


# 🔹 ADD STOCK MOVEMENT
@router.post("")
def add_stock_movement(
    payload: StockMovementCreate,
    db: Session = Depends(get_db)
):
    result = add_stock_movement_service(db, payload)

    return {
        "success": True,
        "message": "Stock movement added successfully",
        "data": result
    }


# 🔹 GET ALL HISTORY
@router.get("")
def get_stock_history(
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "data": get_stock_history_service(db)
    }


# 🔹 GET SUMMARY
@router.get("/summary")
def get_stock_summary(
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "data": get_stock_summary_service(db)
    }


# 🔹 GET CHART DATA
@router.get("/chart")
def get_stock_chart(
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "data": get_stock_chart_service(db)
    }


# 🔹 GET BY INVENTORY ID
@router.get("/inventory/{inventory_id}")
def get_stock_history_by_inventory(
    inventory_id: int,
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "data": get_stock_history_by_inventory_service(db, inventory_id)
    }


# 🔹 RESTORE HISTORY
@router.patch("/{stock_history_id}/restore")
def restore_stock_history(
    stock_history_id: int,
    db: Session = Depends(get_db)
):
    result = restore_stock_history_service(db, stock_history_id)

    return {
        "success": True,
        "message": "Stock history restored successfully",
        "data": result
    }


# 🔹 GET BY ID
@router.get("/{stock_history_id}")
def get_stock_history_by_id(
    stock_history_id: int,
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "data": get_stock_history_by_id_service(db, stock_history_id)
    }


# 🔹 DELETE HISTORY
@router.delete("/{stock_history_id}")
def delete_stock_history(
    stock_history_id: int,
    db: Session = Depends(get_db)
):
    result = delete_stock_history_service(db, stock_history_id)

    return {
        "success": True,
        "message": "Stock history deleted successfully",
        "data": result
    }