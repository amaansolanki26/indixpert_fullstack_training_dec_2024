from fastapi import APIRouter, Depends

from app.db.database import get_db

from app.schemas.menu_category_schemas import (
    MenuCategoryCreate,
    MenuCategoryUpdate
)

from app.services.menu_category_service import (
    create_menu_category_service,
    get_menu_categories_service,
    get_menu_category_by_id_service,
    update_menu_category_service,
    delete_menu_category_service,
    restore_menu_category_service
)

router = APIRouter(
    prefix="/menu-categories",
    tags=["Menu Categories"]
)


# CREATE CATEGORY

@router.post("")
def create_menu_category(
    payload: MenuCategoryCreate,
    db=Depends(get_db)
):

    create_menu_category_service(
        db,
        payload
    )

    return {
        "success": True,
        "message": "Menu category created successfully"
    }


# GET ALL CATEGORIES

@router.get("")
def get_menu_categories(
    db=Depends(get_db)
):

    categories = get_menu_categories_service(db)

    return {
        "success": True,
        "count": len(categories),
        "data": categories
    }


# GET CATEGORY BY ID

@router.get("/{category_id}")
def get_menu_category_by_id(
    category_id: int,
    db=Depends(get_db)
):

    category = get_menu_category_by_id_service(
        db,
        category_id
    )

    return {
        "success": True,
        "data": category
    }


# UPDATE CATEGORY

@router.put("/{category_id}")
def update_menu_category(
    category_id: int,
    payload: MenuCategoryUpdate,
    db=Depends(get_db)
):

    update_menu_category_service(
        db,
        category_id,
        payload
    )

    return {
        "success": True,
        "message": "Menu category updated successfully"
    }


# DELETE CATEGORY

@router.delete("/{category_id}")
def delete_menu_category(
    category_id: int,
    db=Depends(get_db)
):

    delete_menu_category_service(
        db,
        category_id
    )

    return {
        "success": True,
        "message": "Menu category deleted successfully"
    }


# RESTORE CATEGORY

@router.patch("/{category_id}/restore")
def restore_menu_category(
    category_id: int,
    db=Depends(get_db)
):

    restore_menu_category_service(
        db,
        category_id
    )

    return {
        "success": True,
        "message": "Menu category restored successfully"
    }