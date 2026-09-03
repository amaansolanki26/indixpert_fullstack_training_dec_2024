from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.calendar_schedule_member_schemas import (
    CreateCalendarScheduleMemberSchema,
    UpdateCalendarScheduleMemberSchema
)

from app.services.calendar_schedule_member_service import (
    create_schedule_member_service,
    get_schedule_members_service,
    get_schedule_member_by_id_service,
    get_members_by_schedule_service,
    update_schedule_member_service,
    delete_schedule_member_service,
    delete_members_by_schedule_service,
    restore_schedule_member_service
)

router = APIRouter(
    prefix="/calendar-members",
    tags=["Calendar Members"]
)


# 🔹 CREATE
@router.post("")
def create_schedule_member(
    payload: CreateCalendarScheduleMemberSchema,
    db: Session = Depends(get_db)
):
    result = create_schedule_member_service(db, payload)

    return {
        "success": True,
        "message": "Member added successfully",
        "data": result
    }


# 🔹 GET ALL
@router.get("")
def get_schedule_members(
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "data": get_schedule_members_service(db)
    }


# 🔹 DELETE BY SCHEDULE
@router.delete("/schedule/{schedule_id}")
def delete_members_by_schedule(
    schedule_id: int,
    db: Session = Depends(get_db)
):
    result = delete_members_by_schedule_service(db, schedule_id)

    return {
        "success": True,
        "message": "All members deleted successfully",
        "data": result
    }
@router.patch("/restore/{schedule_member_id}")
def restore_schedule_member(
    schedule_member_id: int,
    db: Session = Depends(get_db)
):
    result = restore_schedule_member_service(
        db,
        schedule_member_id
    )

    return {
        "success": True,
        "message": "Member restored successfully",
        "data": result
    }


# 🔹 GET BY SCHEDULE
@router.get("/schedule/{schedule_id}")
def get_members_by_schedule(
    schedule_id: int,
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "data": get_members_by_schedule_service(db, schedule_id)
    }


# 🔹 DYNAMIC LAST
# 🔹 GET BY ID
@router.get("/{schedule_member_id}")
def get_schedule_member_by_id(
    schedule_member_id: int,
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "data": get_schedule_member_by_id_service(db, schedule_member_id)
    }


# 🔹 UPDATE
@router.put("/{schedule_member_id}")
def update_schedule_member(
    schedule_member_id: int,
    payload: UpdateCalendarScheduleMemberSchema,
    db: Session = Depends(get_db)
):
    result = update_schedule_member_service(db, schedule_member_id, payload)

    return {
        "success": True,
        "message": "Member updated successfully",
        "data": result
    }


# 🔹 DELETE SINGLE
@router.delete("/{schedule_member_id}")
def delete_schedule_member(
    schedule_member_id: int,
    db: Session = Depends(get_db)
):
    result = delete_schedule_member_service(db, schedule_member_id)

    return {
        "success": True,
        "message": "Member deleted successfully",
        "data": result
    }

# RESTORE
