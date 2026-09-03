from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


#  CREATE
def add_menu_nutrition_service(db, payload):
    try:
        data = payload if isinstance(payload, dict) else payload.model_dump()

        result = db.execute(
            text("""
                EXEC Reztro.AddMenuNutrition
                    @menu_id=:menu_id,
                    @calories=:calories,
                    @proteins=:proteins,
                    @fats=:fats,
                    @carbs=:carbs
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
def get_menu_nutrition_service(db):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetMenuNutrition
            """)
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


#  GET BY ID
def get_menu_nutrition_by_id_service(db, nutrition_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetMenuNutritionById
                    @nutrition_id=:nutrition_id
            """),
            {
                "nutrition_id": nutrition_id
            }
        )

        item = result.mappings().first()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nutrition not found"
            )

        return item

    except HTTPException:
        raise

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


#  GET BY MENU ID
def get_menu_nutrition_by_menu_id_service(db, payload):
    try:
        data = payload if isinstance(payload, dict) else payload.model_dump()

        result = db.execute(
            text("""
                EXEC Reztro.GetMenuNutritionByMenuId
                    @menu_id=:menu_id
            """),
            data
        )

        item = result.mappings().first()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nutrition not found"
            )

        return item

    except HTTPException:
        raise

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


#  UPDATE BY NUTRITION ID
def update_menu_nutrition_service(db, nutrition_id: int, payload):
    try:
        data = payload if isinstance(payload, dict) else payload.model_dump(exclude_unset=True)

        if not data:
            return None  

        data["nutrition_id"] = nutrition_id

        result = db.execute(
            text("""
                EXEC Reztro.UpdateMenuNutrition
                    @nutrition_id=:nutrition_id,
                    @calories=:calories,
                    @proteins=:proteins,
                    @fats=:fats,
                    @carbs=:carbs
            """),
            data
        )

        db.commit()

        return result.mappings().first()

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


#  UPDATE BY MENU ID
def update_menu_nutrition_by_menu_id_service(db, menu_id: int, payload):
    try:
        data = payload if isinstance(payload, dict) else payload.model_dump()
        data["menu_id"] = menu_id

        result = db.execute(
            text("""
                EXEC Reztro.UpdateMenuNutritionByMenuId
                    @menu_id=:menu_id,
                    @calories=:calories,
                    @proteins=:proteins,
                    @fats=:fats,
                    @carbs=:carbs
            """),
            data
        )

        return result.mappings().first()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )

def delete_menu_nutrition_service(db, nutrition_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.DeleteMenuNutrition
                    @nutrition_id=:nutrition_id
            """),
            {
                "nutrition_id": nutrition_id
            }
        )

        db.commit()  

        return result.mappings().first()

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


#  DELETE BY MENU ID
def delete_menu_nutrition_by_menu_id_service(db, payload):
    try:
        data = payload if isinstance(payload, dict) else payload.model_dump()

        result = db.execute(
            text("""
                EXEC Reztro.DeleteMenuNutritionByMenuId
                    @menu_id=:menu_id
            """),
            data
        )

        return result.mappings().first() 

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )