from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


class ActivityLogCreate(BaseModel):
    admin_id: Optional[int] = Field(default=None, gt=0)
    actor_name: str = Field(..., min_length=1, max_length=100)
    actor_role: Optional[str] = Field(default=None, max_length=100)
    activity_type: str = Field(..., min_length=1, max_length=100)
    activity_title: str = Field(..., min_length=1, max_length=150)
    activity_description: Optional[str] = Field(default=None, max_length=500)


class ActivityLogUpdate(BaseModel):
    actor_name: str = Field(..., min_length=1, max_length=100)
    actor_role: Optional[str] = Field(default=None, max_length=100)
    activity_type: str = Field(..., min_length=1, max_length=100)
    activity_title: str = Field(..., min_length=1, max_length=150)
    activity_description: Optional[str] = Field(default=None, max_length=500)


class ActivityTypeFilter(BaseModel):
    activity_type: str = Field(..., min_length=1)


class ActivityDateFilter(BaseModel):
    activity_date: date


class ActivityLimitFilter(BaseModel):
    limit: int = Field(default=10, gt=0)