from fastapi import APIRouter, Depends

from app.db.database import get_db

from app.schemas.menu_ingredient_schemas import (
    MenuIngredientCreate,
    MenuIngredientUpdate
)

from app.services.menu_ingredient_service import (
    create_menu_ingredient_service,
    get_menu_ingredients_service,
    get_menu_ingredient_by_id_service,
    get_menu_ingredients_by_menu_id_service,
    update_menu_ingredient_service,
    delete_menu_ingredient_service,
    delete_menu_ingredients_by_menu_id_service
)


router = APIRouter(
    prefix="/menu-ingredients",
    tags=["Menu Ingredients"]
)


#  CREATE
@router.post("")
def create_menu_ingredient(payload: MenuIngredientCreate, db=Depends(get_db)):
    data = create_menu_ingredient_service(db, payload)

    return {
        "success": True,
        "message": "Ingredient added successfully",
        "data": data
    }


#  GET ALL
@router.get("")
def get_menu_ingredients(db=Depends(get_db)):
    items = get_menu_ingredients_service(db)

    return {
        "success": True,
        "count": len(items),
        "data": items
    }


#  GET BY ID
@router.get("/{ingredient_id}")
def get_menu_ingredient_by_id(ingredient_id: int, db=Depends(get_db)):
    item = get_menu_ingredient_by_id_service(db, ingredient_id)

    return {
        "success": True,
        "data": item
    }


#  GET BY MENU ID 
@router.get("/menu/{menu_id}")
def get_menu_ingredients_by_menu_id(menu_id: int, db=Depends(get_db)):
    items = get_menu_ingredients_by_menu_id_service(
        db,
        {"menu_id": menu_id}
    )

    return {
        "success": True,
        "count": len(items),
        "data": items
    }


#  UPDATE
@router.put("/{ingredient_id}")
def update_menu_ingredient(
    ingredient_id: int,
    payload: MenuIngredientUpdate,
    db=Depends(get_db)
):
    data = update_menu_ingredient_service(db, ingredient_id, payload)

    return {
        "success": True,
        "message": "Ingredient updated successfully",
        "data": data
    }


#  DELETE BY ID
@router.delete("/{ingredient_id}")
def delete_menu_ingredient(ingredient_id: int, db=Depends(get_db)):
    data = delete_menu_ingredient_service(db, ingredient_id)

    return {
        "success": True,
        "message": "Ingredient deleted successfully",
        "data": data
    }


#  DELETE BY MENU ID 
@router.delete("/menu/{menu_id}")
def delete_menu_ingredients_by_menu_id(menu_id: int, db=Depends(get_db)):
    data = delete_menu_ingredients_by_menu_id_service(
        db,
        {"menu_id": menu_id}
    )

    return {
        "success": True,
        "message": "All ingredients deleted for menu item",
        "data": data
    }