from fastapi import APIRouter, Depends

from app.db.database import get_db

from app.schemas.meal_time_schemas import (
    MealTimeCreate,
    MealTimeUpdate
)

from app.services.meal_time_service import (
    create_meal_time_service,
    get_meal_times_service,
    get_meal_time_by_id_service,
    update_meal_time_service,
    delete_meal_time_service,
    restore_meal_time_service
)


router = APIRouter(
    prefix="/meal-times",
    tags=["Meal Times"]
)


# 🔹 CREATE
@router.post("")
def create_meal_time(
    payload: MealTimeCreate,
    db=Depends(get_db)
):

    data = create_meal_time_service(db, payload)

    return {
        "success": True,
        "message": "Meal time created successfully",
        "data": data
    }


# 🔹 GET ALL
@router.get("")
def get_meal_times(
    db=Depends(get_db)
):

    items = get_meal_times_service(db)

    return {
        "success": True,
        "count": len(items),
        "data": items
    }


# 🔹 GET BY ID
@router.get("/{meal_time_id}")
def get_meal_time_by_id(
    meal_time_id: int,
    db=Depends(get_db)
):

    item = get_meal_time_by_id_service(
        db,
        meal_time_id
    )

    return {
        "success": True,
        "data": item
    }


# 🔹 UPDATE
@router.put("/{meal_time_id}")
def update_meal_time(
    meal_time_id: int,
    payload: MealTimeUpdate,
    db=Depends(get_db)
):

    data = update_meal_time_service(
        db,
        meal_time_id,
        payload
    )

    return {
        "success": True,
        "message": "Meal time updated successfully",
        "data": data
    }


# 🔹 DELETE
@router.delete("/{meal_time_id}")
def delete_meal_time(
    meal_time_id: int,
    db=Depends(get_db)
):

    data = delete_meal_time_service(
        db,
        meal_time_id
    )

    return {
        "success": True,
        "message": "Meal time deleted successfully",
        "data": data
    }


# 🔹 RESTORE
@router.patch("/{meal_time_id}/restore")
def restore_meal_time(
    meal_time_id: int,
    db=Depends(get_db)
):

    data = restore_meal_time_service(
        db,
        meal_time_id
    )

    return {
        "success": True,
        "message": "Meal time restored successfully",
        "data": data
    }