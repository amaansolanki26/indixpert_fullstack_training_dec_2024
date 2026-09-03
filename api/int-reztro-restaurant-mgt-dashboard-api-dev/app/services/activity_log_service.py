from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


# CREATE
def create_activity_log_service(db, payload):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.AddActivityLog
                    @admin_id=:admin_id,
                    @actor_name=:actor_name,
                    @actor_role=:actor_role,
                    @activity_type=:activity_type,
                    @activity_title=:activity_title,
                    @activity_description=:activity_description
            """),
            payload.model_dump()
        )

        response = result.mappings().first()

        db.commit()

        return response

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )

# GET ALL
def get_activity_logs_service(db):
    try:
        result = db.execute(text("EXEC Reztro.GetActivitiesLogs"))
        return result.mappings().all()
    except SQLAlchemyError as e:
        raise HTTPException(500, str(e.orig))


# GET BY ID
def get_activity_log_by_id_service(db, activity_id: int):
    try:
        result = db.execute(
            text("EXEC Reztro.GetActivityLogById @activity_id=:activity_id"),
            {"activity_id": activity_id}
        )

        item = result.mappings().first()

        if not item:
            raise HTTPException(404, "Activity not found")

        return item

    except HTTPException:
        raise
    except SQLAlchemyError as e:
        raise HTTPException(500, str(e.orig))


# GET RECENT
def get_recent_activities_service(db, limit: int):
    try:
        result = db.execute(
            text("EXEC Reztro.GetRecentActivities @limit=:limit"),
            {"limit": limit}
        )
        return result.mappings().all()
    except SQLAlchemyError as e:
        raise HTTPException(500, str(e.orig))


# GET BY TYPE
def get_activities_by_type_service(db, activity_type: str):
    try:
        result = db.execute(
            text("EXEC Reztro.GetActivitiesByType @activity_type=:activity_type"),
            {"activity_type": activity_type}
        )
        return result.mappings().all()
    except SQLAlchemyError as e:
        raise HTTPException(500, str(e.orig))


# GET BY ADMIN
def get_activities_by_admin_service(db, admin_id: int):
    try:
        result = db.execute(
            text("EXEC Reztro.GetActivitiesByAdminId @admin_id=:admin_id"),
            {"admin_id": admin_id}
        )
        return result.mappings().all()
    except SQLAlchemyError as e:
        raise HTTPException(500, str(e.orig))


# GET BY DATE
def get_activities_by_date_service(db, activity_date):
    try:
        result = db.execute(
            text("EXEC Reztro.GetActivitiesByDate @activity_date=:activity_date"),
            {"activity_date": activity_date}
        )
        return result.mappings().all()
    except SQLAlchemyError as e:
        raise HTTPException(500, str(e.orig))


# UPDATE
def update_activity_log_service(db, activity_id: int, payload):
    try:
        params = payload.model_dump()
        params["activity_id"] = activity_id

        result = db.execute(
            text("""
                EXEC Reztro.UpdateActivityLog
                    @activity_id=:activity_id,
                    @actor_name=:actor_name,
                    @actor_role=:actor_role,
                    @activity_type=:activity_type,
                    @activity_title=:activity_title,
                    @activity_description=:activity_description
            """),
            params
        )

        response = result.mappings().first()

        db.commit()

        return response

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(500, str(e.orig))


# DELETE
def delete_activity_log_service(db, activity_id: int):
    try:
        result = db.execute(
            text("EXEC Reztro.DeleteActivityLog @activity_id=:activity_id"),
            {"activity_id": activity_id}
        )

        response = result.mappings().first()

        db.commit()

        return response

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(500, str(e.orig))


# SUMMARY
def get_activity_summary_service(db):
    try:
        result = db.execute(text("EXEC Reztro.GetActivitySummary"))
        return result.mappings().all()
    except SQLAlchemyError as e:
        raise HTTPException(500, str(e.orig))