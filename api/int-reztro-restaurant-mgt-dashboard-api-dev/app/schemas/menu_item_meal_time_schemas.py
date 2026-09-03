from pydantic import BaseModel, Field


class MenuItemMealTimeCreate(BaseModel):
    menu_id: int = Field(..., gt=0)
    meal_time_id: int = Field(..., gt=0)


class MenuItemMealTimeDelete(BaseModel):
    menu_id: int = Field(..., gt=0)
    meal_time_id: int = Field(..., gt=0)