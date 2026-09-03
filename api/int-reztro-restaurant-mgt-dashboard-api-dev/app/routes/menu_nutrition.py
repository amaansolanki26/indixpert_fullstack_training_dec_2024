from fastapi import APIRouter, Depends

from app.db.database import get_db

from app.schemas.menu_nutrition_schemas import (
    MenuNutritionCreate,
    MenuNutritionUpdate
)

from app.services.menu_nutrition_service import (
    add_menu_nutrition_service,
    get_menu_nutrition_service,
    get_menu_nutrition_by_id_service,
    get_menu_nutrition_by_menu_id_service,
    update_menu_nutrition_service,
    update_menu_nutrition_by_menu_id_service,
    delete_menu_nutrition_service,
    delete_menu_nutrition_by_menu_id_service
)

router = APIRouter(
    prefix="/menu-nutrition",
    tags=["Menu Nutrition"]
)


# ADD NUTRITION

@router.post("")
def add_menu_nutrition(payload: MenuNutritionCreate, db=Depends(get_db)):

    data = add_menu_nutrition_service(db, payload)

    return {
        "success": True,
        "message": "Nutrition added successfully",
        "data": data
    }


# GET ALL

@router.get("")
def get_menu_nutrition(db=Depends(get_db)):

    data = get_menu_nutrition_service(db)

    return {
        "success": True,
        "count": len(data),
        "data": data
    }


# GET BY NUTRITION ID

@router.get("/{nutrition_id}")
def get_menu_nutrition_by_id(nutrition_id: int, db=Depends(get_db)):

    data = get_menu_nutrition_by_id_service(db, nutrition_id)

    return {
        "success": True,
        "data": data
    }


# GET BY MENU ID

@router.get("/menu/{menu_id}")
def get_menu_nutrition_by_menu_id(menu_id: int, db=Depends(get_db)):

    data = get_menu_nutrition_by_menu_id_service(db, menu_id)

    return {
        "success": True,
        "data": data
    }


# UPDATE BY NUTRITION ID

@router.put("/{nutrition_id}")
def update_menu_nutrition(
    nutrition_id: int,
    payload: MenuNutritionUpdate,
    db=Depends(get_db)
):

    data = update_menu_nutrition_service(db, nutrition_id, payload)

    return {
        "success": True,
        "message": "Nutrition updated successfully",
        "data": data
    }


# UPDATE BY MENU ID

@router.put("/menu/{menu_id}")
def update_menu_nutrition_by_menu_id(
    menu_id: int,
    payload: MenuNutritionUpdate,
    db=Depends(get_db)
):

    data = update_menu_nutrition_by_menu_id_service(db, menu_id, payload)

    return {
        "success": True,
        "message": "Nutrition updated successfully",
        "data": data
    }


# DELETE BY NUTRITION ID

@router.delete("/{nutrition_id}")
def delete_menu_nutrition(nutrition_id: int, db=Depends(get_db)):

    data = delete_menu_nutrition_service(db, nutrition_id)

    return {
        "success": True,
        "message": "Nutrition deleted successfully",
        "data": data
    }


# DELETE BY MENU ID

@router.delete("/menu/{menu_id}")
def delete_menu_nutrition_by_menu_id(menu_id: int, db=Depends(get_db)):

    data = delete_menu_nutrition_by_menu_id_service(db, menu_id)

    return {
        "success": True,
        "message": "Nutrition deleted successfully",
        "data": data
    }