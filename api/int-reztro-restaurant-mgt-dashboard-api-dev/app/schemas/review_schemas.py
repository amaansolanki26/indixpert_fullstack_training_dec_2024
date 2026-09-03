from pydantic import BaseModel, Field
from typing import Optional


class ReviewCreateSchema(BaseModel):
    customer_id: int = Field(..., gt=0)
    menu_id: int = Field(..., gt=0)

    rating: float = Field(..., ge=0, le=5)

    comment: Optional[str] = Field(None, max_length=1000)

    food_quality: Optional[float] = Field(None, ge=0, le=5)
    service: Optional[float] = Field(None, ge=0, le=5)
    ambiance: Optional[float] = Field(None, ge=0, le=5)
    value_for_money: Optional[float] = Field(None, ge=0, le=5)
    cleanliness: Optional[float] = Field(None, ge=0, le=5)


class ReviewUpdateSchema(BaseModel):
    rating: float = Field(..., ge=0, le=5)

    comment: Optional[str] = Field(None, max_length=1000)

    food_quality: Optional[float] = Field(None, ge=0, le=5)
    service: Optional[float] = Field(None, ge=0, le=5)
    ambiance: Optional[float] = Field(None, ge=0, le=5)
    value_for_money: Optional[float] = Field(None, ge=0, le=5)
    cleanliness: Optional[float] = Field(None, ge=0, le=5)