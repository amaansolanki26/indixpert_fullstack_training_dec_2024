from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


#  ADD
def add_menu_item_meal_time_service(db, payload):
    try:
        data = payload if isinstance(payload, dict) else payload.model_dump()

        result = db.execute(
            text("""
                EXEC Reztro.AddMenuItemMealTime
                    @menu_id=:menu_id,
                    @meal_time_id=:meal_time_id
            """),
            data
        )

        return result.mappings().first()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


#  GET ALL
def get_menu_item_meal_times_service(db):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetMenuItemMealTimes
            """)
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


#  GET BY MENU ID
def get_meal_times_by_menu_id_service(db, payload):
    try:
        data = payload if isinstance(payload, dict) else payload.model_dump()

        result = db.execute(
            text("""
                EXEC Reztro.GetMealTimesByMenuId
                    @menu_id=:menu_id
            """),
            data
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


#  GET BY MEAL TIME ID
def get_menu_items_by_meal_time_id_service(db, payload):
    try:
        if payload is None:
            raise HTTPException(status_code=400, detail="Payload cannot be None")

        data = payload if isinstance(payload, dict) else payload.model_dump(exclude_unset=True)
        result = db.execute(
            text("""
                EXEC Reztro.GetMenuItemsByMealTimeId
                    @meal_time_id=:meal_time_id
            """),
            data
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


#  REMOVE SINGLE
def remove_menu_item_meal_time_service(db, payload):
    try:
        if payload is None:
            raise HTTPException(status_code=400, detail="Payload cannot be None")

        data = payload if isinstance(payload, dict) else payload.model_dump(exclude_unset=True)
        result = db.execute(
            text("""
                EXEC Reztro.RemoveMenuItemMealTime
                    @menu_id=:menu_id,
                    @meal_time_id=:meal_time_id
            """),
            data
        )

        return result.mappings().first()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


#  REMOVE ALL FROM MENU
def remove_all_meal_times_from_menu_item_service(db, payload):
    try:
        if payload is None:
            raise HTTPException(status_code=400, detail="Payload cannot be None")

        data = payload if isinstance(payload, dict) else payload.model_dump(exclude_unset=True)

        result = db.execute(
            text("""
                EXEC Reztro.RemoveAllMealTimesFromMenuItem
                    @menu_id=:menu_id
            """),
            data
        )

        return result.mappings().first()

    except SQLAlchemyError as e:
        raise HTTPException(status_code=400, detail=str(e.orig))

#  REMOVE MEAL TIME FROM ALL MENUS
def remove_meal_time_from_all_menu_items_service(db, payload):
    try:
        data = payload if isinstance(payload, dict) else payload.model_dump()
        result = db.execute(
            text("""
                EXEC Reztro.RemoveMealTimeFromAllMenuItems
                    @meal_time_id=:meal_time_id
            """),
            data
        )

        return result.mappings().first()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )