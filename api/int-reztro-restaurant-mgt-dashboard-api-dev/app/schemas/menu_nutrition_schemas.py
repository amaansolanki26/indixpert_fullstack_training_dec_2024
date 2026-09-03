from decimal import Decimal
from pydantic import BaseModel, Field


class MenuNutritionCreate(BaseModel):

    menu_id: int = Field(..., gt=0)

    calories: int = Field(
        default=0,
        ge=0
    )

    proteins: Decimal = Field(
        default=0,
        ge=0
    )

    fats: Decimal = Field(
        default=0,
        ge=0
    )

    carbs: Decimal = Field(
        default=0,
        ge=0
    )


class MenuNutritionUpdate(BaseModel):

    calories: int = Field(
        default=0,
        ge=0
    )

    proteins: Decimal = Field(
        default=0,
        ge=0
    )

    fats: Decimal = Field(
        default=0,
        ge=0
    )

    carbs: Decimal = Field(
        default=0,
        ge=0
    )