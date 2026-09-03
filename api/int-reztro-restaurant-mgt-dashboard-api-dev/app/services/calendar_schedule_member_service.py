from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def safe_fetch_one(result):
    try:
        rows = result.mappings().all()
        return rows[0] if rows else None
    except Exception:
        return None


# 🔹 CREATE MEMBER
def create_schedule_member_service(db, payload):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.AddCalendarScheduleMember
                    @schedule_id=:schedule_id,
                    @member_name=:member_name,
                    @member_initials=:member_initials
            """),
            payload.model_dump()
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


# 🔹 GET ALL MEMBERS
def get_schedule_members_service(db):
    try:
        result = db.execute(
            text("EXEC Reztro.GetCalendarScheduleMembers")
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET MEMBER BY ID
def get_schedule_member_by_id_service(db, schedule_member_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetCalendarScheduleMemberById
                    @schedule_member_id=:schedule_member_id
            """),
            {"schedule_member_id": schedule_member_id}
        )

        data = safe_fetch_one(result)

        if not data:
            raise HTTPException(status_code=404, detail="Member not found")

        if data.get("success") == 0:
            raise HTTPException(status_code=400, detail=data.get("message"))

        return data

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET MEMBERS BY SCHEDULE
def get_members_by_schedule_service(db, schedule_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetCalendarScheduleMembersByScheduleId
                    @schedule_id=:schedule_id
            """),
            {"schedule_id": schedule_id}
        )

        rows = result.mappings().all()

        # ⚠️ This SP may return success row OR normal rows
        if rows and rows[0].get("success") == 0:
            raise HTTPException(status_code=400, detail=rows[0].get("message"))

        return rows

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 UPDATE MEMBER
def update_schedule_member_service(db, schedule_member_id: int, payload):
    try:
        params = payload.model_dump()
        params["schedule_member_id"] = schedule_member_id

        result = db.execute(
            text("""
                EXEC Reztro.UpdateCalendarScheduleMember
                    @schedule_member_id=:schedule_member_id,
                    @member_name=:member_name,
                    @member_initials=:member_initials
            """),
            params
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


# 🔹 DELETE SINGLE MEMBER
def delete_schedule_member_service(db, schedule_member_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.DeleteCalendarScheduleMember
                    @schedule_member_id=:schedule_member_id
            """),
            {"schedule_member_id": schedule_member_id}
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


# 🔹 DELETE MEMBERS BY SCHEDULE
def delete_members_by_schedule_service(db, schedule_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.DeleteCalendarScheduleMembersByScheduleId
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
        
def restore_schedule_member_service(db, schedule_member_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.RestoreCalendarScheduleMember
                    @schedule_member_id=:schedule_member_id
            """),
            {
                "schedule_member_id": schedule_member_id
            }
        )

        data = safe_fetch_one(result)
        db.commit()

        if data and data.get("success") == 0:
            raise HTTPException(
                status_code=400,
                detail=data.get("message")
            )

        return data

    except SQLAlchemyError as e:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )