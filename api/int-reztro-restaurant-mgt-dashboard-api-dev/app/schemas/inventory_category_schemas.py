from pydantic import BaseModel, Field
from typing import Optional


class InventoryCategoryCreate(BaseModel):

    category_name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )


class InventoryCategoryUpdate(BaseModel):

    category_name: Optional[str] = Field(
        None,
        min_length=2,
        max_length=100
    )