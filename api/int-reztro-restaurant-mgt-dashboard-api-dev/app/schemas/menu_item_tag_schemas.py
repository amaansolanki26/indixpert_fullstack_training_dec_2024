from pydantic import (
    BaseModel,
    Field,
)

class MenuItemTagCreate(BaseModel):
    menu_id: int = Field(..., gt=0)
    tag_id: int = Field(..., gt=0)


class MenuItemTagDelete(BaseModel):
    menu_id: int = Field(..., gt=0)
    tag_id: int = Field(..., gt=0)