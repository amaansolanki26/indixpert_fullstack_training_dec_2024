from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CreateCalendarScheduleMemberSchema(BaseModel):
    schedule_id: int = Field(..., gt=0)

    member_name: str = Field(..., min_length=1, max_length=100)
    member_initials: Optional[str] = Field(default=None, max_length=10)


class UpdateCalendarScheduleMemberSchema(BaseModel):
    member_name: str = Field(..., min_length=1, max_length=100)
    member_initials: Optional[str] = Field(default=None, max_length=10)


class CalendarScheduleMemberResponseSchema(BaseModel):
    schedule_member_id: int
    schedule_id: int
    member_name: str
    member_initials: Optional[str]
    created_at: datetime