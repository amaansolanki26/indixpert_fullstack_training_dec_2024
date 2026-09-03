from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.db.database import get_db

from app.schemas.calendar_schedule_schemas import (
    CreateCalendarScheduleSchema,
    UpdateCalendarScheduleSchema
)

from app.services.calendar_schedule_service import (
    create_calendar_schedule_service,
    get_calendar_schedules_service,
    get_calendar_schedule_by_id_service,
    get_calendar_schedules_by_date_service,
    get_upcoming_calendar_schedules_service,
    update_calendar_schedule_service,
    delete_calendar_schedule_service,
    restore_calendar_schedule_service
)

router = APIRouter(
    prefix="/calendar",
    tags=["Calendar"]
)


# CREATE
@router.post("")
def create_calendar_schedule(
    payload: CreateCalendarScheduleSchema,
    db: Session = Depends(get_db)
):
    result = create_calendar_schedule_service(db, payload)

    return {
        "success": True,
        "message": "Schedule created successfully",
        "data": result
    }


# GET ALL
@router.get("")
def get_calendar_schedules(
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "data": get_calendar_schedules_service(db)
    }


# GET UPCOMING
@router.get("/upcoming")
def get_upcoming_calendar_schedules(
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "data": get_upcoming_calendar_schedules_service(db)
    }


# GET BY DATE
@router.get("/date/{schedule_date}")
def get_calendar_schedules_by_date(
    schedule_date: date,
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "data": get_calendar_schedules_by_date_service(db, schedule_date)
    }


# RESTORE
@router.patch("/restore/{schedule_id}")
def restore_calendar_schedule(
    schedule_id: int,
    db: Session = Depends(get_db)
):
    result = restore_calendar_schedule_service(db, schedule_id)

    return {
        "success": True,
        "message": "Schedule restored successfully",
        "data": result
    }


# GET BY ID
@router.get("/{schedule_id}")
def get_calendar_schedule_by_id(
    schedule_id: int,
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "data": get_calendar_schedule_by_id_service(db, schedule_id)
    }


# UPDATE
@router.put("/{schedule_id}")
def update_calendar_schedule(
    schedule_id: int,
    payload: UpdateCalendarScheduleSchema,
    db: Session = Depends(get_db)
):
    result = update_calendar_schedule_service(db, schedule_id, payload)

    return {
        "success": True,
        "message": "Schedule updated successfully",
        "data": result
    }


# DELETE 
@router.delete("/{schedule_id}")
def delete_calendar_schedule(
    schedule_id: int,
    db: Session = Depends(get_db)
):
    result = delete_calendar_schedule_service(db, schedule_id)

    return {
        "success": True,
        "message": "Schedule deleted successfully",
        "data": result
    }