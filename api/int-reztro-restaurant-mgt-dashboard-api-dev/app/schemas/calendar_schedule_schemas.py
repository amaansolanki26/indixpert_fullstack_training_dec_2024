from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CreateCalendarScheduleSchema(BaseModel):
    admin_id: Optional[int] = Field(default=None, gt=0)

    title: str = Field(..., min_length=1, max_length=150)
    schedule_type: str = Field(..., min_length=1, max_length=100)

    location: Optional[str] = Field(default=None, max_length=150)

    start_datetime: datetime
    end_datetime: datetime

    notes: Optional[str] = None


class UpdateCalendarScheduleSchema(BaseModel):
    admin_id: Optional[int] = Field(default=None, gt=0)

    title: str = Field(..., min_length=1, max_length=150)
    schedule_type: str = Field(..., min_length=1, max_length=100)

    location: Optional[str] = Field(default=None, max_length=150)

    start_datetime: datetime
    end_datetime: datetime

    notes: Optional[str] = None


class CalendarScheduleResponseSchema(BaseModel):
    schedule_id: int
    admin_id: Optional[int]
    admin_name: Optional[str] = None
    title: str
    schedule_type: str
    location: Optional[str]
    start_datetime: datetime
    end_datetime: datetime
    notes: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]