from fastapi import APIRouter, Depends

from app.db.database import get_db

from app.schemas.inventory_category_schemas import (
    InventoryCategoryCreate,
    InventoryCategoryUpdate
)

from app.services.inventory_category_service import (
    create_inventory_category_service,
    get_inventory_categories_service,
    get_inventory_category_by_id_service,
    update_inventory_category_service,
    delete_inventory_category_service,
    restore_inventory_category_service
)


router = APIRouter(
    prefix="/inventory-categories",
    tags=["Inventory Categories"]
)


# 🔹 CREATE
@router.post("")
def create_inventory_category(
    payload: InventoryCategoryCreate,
    db=Depends(get_db)
):
    data = create_inventory_category_service(db, payload)

    return {
        "success": True,
        "message": "Category created successfully",
        "data": data
    }


# 🔹 GET ALL
@router.get("")
def get_inventory_categories(
    db=Depends(get_db)
):
    items = get_inventory_categories_service(db)

    return {
        "success": True,
        "count": len(items),
        "data": items
    }


# 🔹 RESTORE 
@router.patch("/{inventory_category_id}/restore")
def restore_inventory_category(
    inventory_category_id: int,
    db=Depends(get_db)
):
    data = restore_inventory_category_service(
        db,
        inventory_category_id
    )

    return {
        "success": True,
        "message": "Category restored successfully",
        "data": data
    }


# 🔹 GET BY ID
@router.get("/{inventory_category_id}")
def get_inventory_category_by_id(
    inventory_category_id: int,
    db=Depends(get_db)
):
    item = get_inventory_category_by_id_service(
        db,
        inventory_category_id
    )

    return {
        "success": True,
        "data": item
    }


# 🔹 UPDATE
@router.put("/{inventory_category_id}")
def update_inventory_category(
    inventory_category_id: int,
    payload: InventoryCategoryUpdate,
    db=Depends(get_db)
):
    data = update_inventory_category_service(
        db,
        inventory_category_id,
        payload
    )

    return {
        "success": True,
        "message": "Category updated successfully",
        "data": data
    }


# 🔹 DELETE
@router.delete("/{inventory_category_id}")
def delete_inventory_category(
    inventory_category_id: int,
    db=Depends(get_db)
):
    data = delete_inventory_category_service(
        db,
        inventory_category_id
    )

    return {
        "success": True,
        "message": "Category deleted successfully",
        "data": data
    }