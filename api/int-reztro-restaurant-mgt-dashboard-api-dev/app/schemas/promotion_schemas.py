from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field


class PromotionCreate(BaseModel):

    promotion_title: str = Field(
        ...,
        min_length=3,
        max_length=150
    )

    promotion_code: Optional[str] = Field(
        None,
        max_length=50
    )

    discount_type: str = Field(
        ...,
        max_length=50
    )

    discount_value: float

    start_date: Optional[datetime] = None

    end_date: Optional[datetime] = None

    min_order_amount: Optional[float] = None

    max_discount_amount: Optional[float] = None


class PromotionUpdate(BaseModel):

    promotion_title: str = Field(
        ...,
        min_length=3,
        max_length=150
    )

    promotion_code: Optional[str] = Field(
        None,
        max_length=50
    )

    discount_type: str = Field(
        ...,
        max_length=50
    )

    discount_value: float

    start_date: Optional[datetime] = None

    end_date: Optional[datetime] = None

    min_order_amount: Optional[float] = None

    max_discount_amount: Optional[float] = None


class PromotionDiscountRequest(BaseModel):

    promotion_code: str

    order_amount: float