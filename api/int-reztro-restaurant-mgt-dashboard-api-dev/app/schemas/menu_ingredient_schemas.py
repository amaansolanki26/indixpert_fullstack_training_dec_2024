from pydantic import BaseModel, Field


class MenuIngredientCreate(BaseModel):
    menu_id: int = Field(..., gt=0)
    ingredient_name: str = Field(..., min_length=1, max_length=150)


class MenuIngredientUpdate(BaseModel):
    ingredient_name: str = Field(..., min_length=1, max_length=150)