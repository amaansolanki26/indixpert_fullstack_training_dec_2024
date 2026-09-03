from fastapi import APIRouter, Depends

from app.db.database import get_db

from app.schemas.menu_item_meal_time_schemas import (
    MenuItemMealTimeCreate,
    MenuItemMealTimeDelete
)

from app.services.menu_item_meal_time_service import (
    add_menu_item_meal_time_service,
    get_menu_item_meal_times_service,
    get_meal_times_by_menu_id_service,
    get_menu_items_by_meal_time_id_service,
    remove_menu_item_meal_time_service,
    remove_all_meal_times_from_menu_item_service,
    remove_meal_time_from_all_menu_items_service
)


router = APIRouter(
    prefix="/menu-item-meal-times",
    tags=["Menu Item Meal Times"]
)


#  ADD
@router.post("")
def add_menu_item_meal_time(payload: MenuItemMealTimeCreate, db=Depends(get_db)):
    data = add_menu_item_meal_time_service(db, payload)

    return {
        "success": True,
        "message": "Meal time assigned to menu item successfully",
        "data": data
    }


#  GET ALL
@router.get("")
def get_menu_item_meal_times(db=Depends(get_db)):
    items = get_menu_item_meal_times_service(db)

    return {
        "success": True,
        "count": len(items),
        "data": items
    }


#  GET MEAL TIMES BY MENU ID 
@router.get("/menu/{menu_id}")
def get_meal_times_by_menu_id(menu_id: int, db=Depends(get_db)):
    items = get_meal_times_by_menu_id_service(
        db,
        {"menu_id": menu_id}
    )

    return {
        "success": True,
        "count": len(items),
        "data": items
    }


#  GET MENU ITEMS BY MEAL TIME ID 
@router.get("/meal-time/{meal_time_id}")
def get_menu_items_by_meal_time_id(meal_time_id: int, db=Depends(get_db)):
    items = get_menu_items_by_meal_time_id_service(
        db,
        {"meal_time_id": meal_time_id}
    )

    return {
        "success": True,
        "count": len(items),
        "data": items
    }


#  REMOVE SINGLE (menu_id + meal_time_id)
@router.delete("")
def remove_menu_item_meal_time(payload: MenuItemMealTimeDelete, db=Depends(get_db)):
    data = remove_menu_item_meal_time_service(db, payload)

    return {
        "success": True,
        "message": "Meal time removed from menu item successfully",
        "data": data
    }


#  REMOVE ALL FROM MENU 
@router.delete("/menu/{menu_id}")
def remove_all_meal_times_from_menu_item(menu_id: int, db=Depends(get_db)):
    data = remove_all_meal_times_from_menu_item_service(
        db,
        {"menu_id": menu_id}
    )

    return {
        "success": True,
        "message": "All meal times removed from menu item",
        "data": data
    }


#  REMOVE MEAL TIME FROM ALL MENUS 
@router.delete("/meal-time/{meal_time_id}")
def remove_meal_time_from_all_menu_items(meal_time_id: int, db=Depends(get_db)):
    data = remove_meal_time_from_all_menu_items_service(
        db,
        {"meal_time_id": meal_time_id}
    )

    return {
        "success": True,
        "message": "Meal time removed from all menu items",
        "data": data
    }