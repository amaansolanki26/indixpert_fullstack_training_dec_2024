from pydantic import BaseModel, Field


class MealTimeCreate(BaseModel):

    meal_time_name: str = Field(
        ...,
        min_length=2,
        max_length=50
    )


class MealTimeUpdate(BaseModel):

    meal_time_name: str = Field(
        ...,
        min_length=2,
        max_length=50
    )


class MealTimeIdRequest(BaseModel):

    meal_time_id: int = Field(
        ...,
        gt=0
    )