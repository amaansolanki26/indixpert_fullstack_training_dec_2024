from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.inventory_item_schemas import (
    InventoryItemCreate,
    InventoryItemUpdate,
    InventoryStockUpdate
)

from app.services.inventory_item_service import (
    add_inventory_item_service,
    get_inventory_items_service,
    get_inventory_item_by_id_service,
    update_inventory_item_service,
    update_inventory_stock_service,
    delete_inventory_item_service,
    restore_inventory_item_service,
    get_low_stock_inventory_service,
    get_inventory_summary_service
)

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_inventory_item(
    payload: InventoryItemCreate,
    db: Session = Depends(get_db)
):
    data = add_inventory_item_service(db, payload)

    return {
        "success": True,
        "message": "Inventory item created successfully",
        "data": data
    }


@router.get("")
def get_inventory_items(db: Session = Depends(get_db)):

    data = get_inventory_items_service(db)

    return {
        "success": True,
        "data": data
    }

@router.get("/low-stock")
def get_low_stock_items(db: Session = Depends(get_db)):

    data = get_low_stock_inventory_service(db)

    return {
        "success": True,
        "data": data
    }


@router.get("/summary")
def get_inventory_summary(db: Session = Depends(get_db)):

    data = get_inventory_summary_service(db)

    return {
        "success": True,
        "data": data
    }


@router.patch("/{inventory_id}/stock")
def update_inventory_stock(
    inventory_id: int,
    payload: InventoryStockUpdate,
    db: Session = Depends(get_db)
):
    data = update_inventory_stock_service(db, inventory_id, payload)

    return {
        "success": True,
        "message": "Stock updated successfully",
        "data": data
    }


@router.patch("/{inventory_id}/restore")
def restore_inventory_item(
    inventory_id: int,
    db: Session = Depends(get_db)
):
    restore_inventory_item_service(db, inventory_id)

    return {
        "success": True,
        "message": "Inventory item restored successfully"
    }


@router.get("/{inventory_id}")
def get_inventory_item(
    inventory_id: int,
    db: Session = Depends(get_db)
):
    data = get_inventory_item_by_id_service(db, inventory_id)

    return {
        "success": True,
        "data": data
    }


@router.put("/{inventory_id}")
def update_inventory_item(
    inventory_id: int,
    payload: InventoryItemUpdate,
    db: Session = Depends(get_db)
):
    data = update_inventory_item_service(db, inventory_id, payload)

    return {
        "success": True,
        "message": "Inventory item updated successfully",
        "data": data
    }


@router.delete("/{inventory_id}")
def delete_inventory_item(
    inventory_id: int,
    db: Session = Depends(get_db)
):
    delete_inventory_item_service(db, inventory_id)

    return {
        "success": True,
        "message": "Inventory item deleted successfully"
    }