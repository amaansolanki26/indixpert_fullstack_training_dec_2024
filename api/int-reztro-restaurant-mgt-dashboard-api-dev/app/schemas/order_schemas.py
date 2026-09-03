from typing import Literal

from pydantic import (
    BaseModel,
    Field
)

from app.schemas.payment_schemas import PaymentCreate
from app.schemas.dinein_order_schemas import DineInOrderCreate
from app.schemas.takeaway_order_schemas import TakeawayOrderCreate
from app.schemas.online_order_schemas import OnlineOrderCreate


class OrderItemPayload(BaseModel):

    menu_id: int = Field(..., gt=0)

    quantity: int = Field(
        ...,
        gt=0
    )

    notes: str | None = Field(
        None,
        max_length=500
    )


class OrderCreate(BaseModel):

    customer_id: int = Field(..., gt=0)

    order_type: Literal[
        "Dine-In",
        "Takeaway",
        "Online"
    ]

    items: list[OrderItemPayload] = []

    dine_in_details: DineInOrderCreate | None = None

    takeaway_details: TakeawayOrderCreate | None = None

    online_details: OnlineOrderCreate | None = None

    payment: PaymentCreate | None = None


class OrderUpdate(BaseModel):

    customer_id: int = Field(..., gt=0)

    order_type: Literal[
        "Dine-In",
        "Takeaway",
        "Online"
    ]

    order_status: Literal[
        "On Process",
        "Completed",
        "Cancelled"
    ]


class OrderStatusUpdate(BaseModel):

    order_status: Literal[
        "On Process",
        "Completed",
        "Cancelled"
    ]
    tracking_note: str | None = None


class ApplyPromotionRequest(BaseModel):

    order_id: int = Field(
        ...,
        gt=0
    )

    promotion_code: str = Field(
        ...,
        min_length=1,
        max_length=50
    )