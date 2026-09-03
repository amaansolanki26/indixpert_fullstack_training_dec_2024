from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


# 🔹 CREATE
def create_meal_time_service(db, payload):
    try:
        params = payload.model_dump(exclude_none=True)

        result = db.execute(
            text("""
                EXEC Reztro.AddMealTime
                    @meal_time_name=:meal_time_name
            """),
            params
        )

        rows = result.mappings().all()
        data = rows[0] if rows else None

        db.commit()

        if data is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Meal time already exists or not created"
            )

        return data

    except HTTPException:
        raise

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database error while creating meal time"
        )


# 🔹 GET ALL
def get_meal_times_service(db):
    try:
        result = db.execute(
            text("EXEC Reztro.GetMealTimes")
        )

        data = result.mappings().all()

        return data

    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch meal times"
        )


# 🔹 GET BY ID
def get_meal_time_by_id_service(db, meal_time_id: int):
    try:
        if meal_time_id <= 0:
            raise HTTPException(
                status_code=400,
                detail="Invalid meal_time_id"
            )

        result = db.execute(
            text("""
                EXEC Reztro.GetMealTimeById
                    @meal_time_id=:meal_time_id
            """),
            {"meal_time_id": meal_time_id}
        )

        rows = result.mappings().all()
        item = rows[0] if rows else None

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meal time not found"
            )

        return item

    except HTTPException:
        raise

    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database error while fetching meal time"
        )


# 🔹 UPDATE
def update_meal_time_service(db, meal_time_id: int, payload):
    try:
        if meal_time_id <= 0:
            raise HTTPException(
                status_code=400,
                detail="Invalid meal_time_id"
            )

        params = payload.model_dump(exclude_none=True)
        params["meal_time_id"] = meal_time_id

        result = db.execute(
            text("""
                EXEC Reztro.UpdateMealTime
                    @meal_time_id=:meal_time_id,
                    @meal_time_name=:meal_time_name
            """),
            params
        )

        rows = result.mappings().all()
        data = rows[0] if rows else None

        db.commit()

        if data is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Update failed (duplicate or not found)"
            )

        return data

    except HTTPException:
        raise

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database error while updating meal time"
        )


# 🔹 DELETE
def delete_meal_time_service(db, meal_time_id: int):
    try:
        if meal_time_id <= 0:
            raise HTTPException(
                status_code=400,
                detail="Invalid meal_time_id"
            )

        result = db.execute(
            text("""
                EXEC Reztro.DeleteMealTime
                    @meal_time_id=:meal_time_id
            """),
            {"meal_time_id": meal_time_id}
        )

        rows = result.mappings().all()
        data = rows[0] if rows else None

        db.commit()

        if data is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete (in use or not found)"
            )

        return data

    except HTTPException:
        raise

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database error while deleting meal time"
        )


# 🔹 RESTORE
def restore_meal_time_service(db, meal_time_id: int):
    try:
        if meal_time_id <= 0:
            raise HTTPException(
                status_code=400,
                detail="Invalid meal_time_id"
            )

        result = db.execute(
            text("""
                EXEC Reztro.RestoreMealTime
                    @meal_time_id=:meal_time_id
            """),
            {"meal_time_id": meal_time_id}
        )

        rows = result.mappings().all()
        data = rows[0] if rows else None

        db.commit()

        if data is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Restore failed (not found or already active)"
            )

        return data

    except HTTPException:
        raise

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database error while restoring meal time"
        )