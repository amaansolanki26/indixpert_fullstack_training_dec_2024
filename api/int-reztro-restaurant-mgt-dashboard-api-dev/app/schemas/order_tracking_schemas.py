from pydantic import BaseModel, Field
from typing import Optional


class OrderTrackingCreate(BaseModel):

    order_id: int = Field(
        gt=0,
        description="Order ID must be greater than 0"
    )

    tracking_status: str = Field(
        min_length=2,
        max_length=100,
        description="Tracking status"
    )

    tracking_note: Optional[str] = Field(
        default=None,
        max_length=255,
        description="Tracking note"
    )

    sort_order: Optional[int] = Field(
        default=None,
        ge=1,
        description="Sort order"
    )


class OrderTrackingUpdate(BaseModel):

    tracking_status: str = Field(
        min_length=2,
        max_length=100,
        description="Tracking status"
    )

    tracking_note: Optional[str] = Field(
        default=None,
        max_length=255,
        description="Tracking note"
    )

    sort_order: Optional[int] = Field(
        default=None,
        ge=1,
        description="Sort order"
    )


class OrderStatusTrackingUpdate(BaseModel):

    order_status: str = Field(
        min_length=2,
        max_length=50,
        description="Order status"
    )

    tracking_note: Optional[str] = Field(
        default=None,
        max_length=255,
        description="Tracking note"
    )
class OrderStatusUpdate(BaseModel):

    order_status: str = Field(
        min_length=2,
        max_length=50
    )

    tracking_note: Optional[str] = Field(
        default=None,
        max_length=255
    )