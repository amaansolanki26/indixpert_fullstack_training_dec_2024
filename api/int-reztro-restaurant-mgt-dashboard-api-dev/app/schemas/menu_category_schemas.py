from pydantic import BaseModel, Field


class MenuCategoryCreate(BaseModel):

    category_name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )


class MenuCategoryUpdate(BaseModel):

    category_name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )