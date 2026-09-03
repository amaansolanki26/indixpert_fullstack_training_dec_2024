from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timezone


def safe_fetch_one(result):
    try:
        return result.mappings().first()
    except Exception:
        return None


# 🔹 CREATE
def create_calendar_schedule_service(db, payload):
    try:
        data = payload.model_dump()

        start_dt = data["start_datetime"]
        end_dt = data["end_datetime"]

        if start_dt.tzinfo is None:
            start_dt = start_dt.replace(tzinfo=timezone.utc)

        if end_dt.tzinfo is None:
            end_dt = end_dt.replace(tzinfo=timezone.utc)

        now = datetime.now(timezone.utc)

        if start_dt <= now:
            raise HTTPException(
                status_code=400,
                detail="Start datetime must be in the future"
            )

        if end_dt <= start_dt:
            raise HTTPException(
                status_code=400,
                detail="End datetime must be greater than start datetime"
            )

        result = db.execute(
            text("""
                EXEC Reztro.AddCalendarSchedule
                    @admin_id=:admin_id,
                    @title=:title,
                    @schedule_type=:schedule_type,
                    @location=:location,
                    @start_datetime=:start_datetime,
                    @end_datetime=:end_datetime,
                    @notes=:notes
            """),
            data
        )

        response = safe_fetch_one(result)
        db.commit()

        if response and response.get("success") == 0:
            raise HTTPException(status_code=400, detail=response.get("message"))

        return response

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET ALL
def get_calendar_schedules_service(db):
    try:
        result = db.execute(text("EXEC Reztro.GetCalendarSchedules"))
        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET BY ID
def get_calendar_schedule_by_id_service(db, schedule_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetCalendarScheduleById
                    @schedule_id=:schedule_id
            """),
            {"schedule_id": schedule_id}
        )

        data = safe_fetch_one(result)

        if not data:
            raise HTTPException(status_code=404, detail="Schedule not found")

        if data.get("success") == 0:
            raise HTTPException(status_code=400, detail=data.get("message"))

        return data

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET BY DATE
def get_calendar_schedules_by_date_service(db, schedule_date):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetCalendarSchedulesByDate
                    @schedule_date=:schedule_date
            """),
            {"schedule_date": schedule_date}
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET UPCOMING
def get_upcoming_calendar_schedules_service(db):
    try:
        result = db.execute(text("EXEC Reztro.GetUpcomingCalendarSchedules"))
        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 UPDATE
def update_calendar_schedule_service(db, schedule_id: int, payload):
    try:
        params = payload.model_dump()
        params["schedule_id"] = schedule_id

        start_dt = params["start_datetime"]
        end_dt = params["end_datetime"]

        if start_dt.tzinfo is None:
            start_dt = start_dt.replace(tzinfo=timezone.utc)

        if end_dt.tzinfo is None:
            end_dt = end_dt.replace(tzinfo=timezone.utc)

        now = datetime.now(timezone.utc)

        if start_dt <= now:
            raise HTTPException(
                status_code=400,
                detail="Start datetime must be in the future"
            )

        if end_dt <= start_dt:
            raise HTTPException(
                status_code=400,
                detail="End datetime must be greater than start datetime"
            )

        result = db.execute(
            text("""
                EXEC Reztro.UpdateCalendarSchedule
                    @schedule_id=:schedule_id,
                    @admin_id=:admin_id,
                    @title=:title,
                    @schedule_type=:schedule_type,
                    @location=:location,
                    @start_datetime=:start_datetime,
                    @end_datetime=:end_datetime,
                    @notes=:notes
            """),
            params
        )

        response = safe_fetch_one(result)
        db.commit()

        if response and response.get("success") == 0:
            raise HTTPException(status_code=400, detail=response.get("message"))

        return response

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 DELETE
def delete_calendar_schedule_service(db, schedule_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.DeleteCalendarSchedule
                    @schedule_id=:schedule_id
            """),
            {"schedule_id": schedule_id}
        )

        data = safe_fetch_one(result)
        db.commit()

        if data and data.get("success") == 0:
            raise HTTPException(status_code=400, detail=data.get("message"))

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 RESTORE
def restore_calendar_schedule_service(db, schedule_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.RestoreCalendarSchedule
                    @schedule_id=:schedule_id
            """),
            {"schedule_id": schedule_id}
        )

        data = safe_fetch_one(result)
        db.commit()

        if data and data.get("success") == 0:
            raise HTTPException(status_code=400, detail=data.get("message"))

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )