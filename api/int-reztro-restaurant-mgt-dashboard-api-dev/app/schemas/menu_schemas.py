from decimal import Decimal
from pydantic import BaseModel, Field
from typing import Optional, List


class Nutrition(BaseModel):
    calories: Optional[int] = None
    proteins: Optional[int] = None
    fats: Optional[int] = None
    carbs: Optional[int] = None


class MenuItemCreate(BaseModel):

    category_id: int = Field(..., gt=0)
    category_ids: Optional[List[int]] = None  

    name: str = Field(..., min_length=2, max_length=150)

    image_url: Optional[str] = Field(None, max_length=500)

    price: Decimal = Field(..., gt=0)

    description: Optional[str] = Field(None, max_length=1000)

    values_text: Optional[str] = Field(None, max_length=500)

    is_featured: bool = False
    is_recommended: bool = False
    is_new: bool = False

    nutrition: Optional[Nutrition] = None
    ingredients: Optional[List[str]] = None
    tag_ids: Optional[List[int]] = None
    meal_time_ids: Optional[List[int]] = None
    promotion_ids: Optional[List[int]] = None


class MenuItemUpdate(BaseModel):

    category_id: Optional[int] = Field(None, gt=0)
    category_ids: Optional[List[int]] = None

    name: Optional[str] = Field(None, min_length=2, max_length=150)

    image_url: Optional[str] = Field(None, max_length=500)

    price: Optional[Decimal] = Field(None, gt=0)

    description: Optional[str] = Field(None, max_length=1000)

    values_text: Optional[str] = Field(None, max_length=500)

    is_featured: Optional[bool] = None
    is_recommended: Optional[bool] = None
    is_new: Optional[bool] = None

    nutrition: Optional[Nutrition] = None
    ingredients: Optional[List[str]] = None
    tag_ids: Optional[List[int]] = None
    meal_time_ids: Optional[List[int]] = None
    promotion_ids: Optional[List[int]] = None


class MenuAvailabilityUpdate(BaseModel):
    is_available: bool


class MenuStatsUpdate(BaseModel):

    rating: Decimal = Field(..., ge=0, le=5)

    total_reviews: int = Field(..., ge=0)

    total_orders: int = Field(..., ge=0)

    favorites_count: int = Field(..., ge=0)