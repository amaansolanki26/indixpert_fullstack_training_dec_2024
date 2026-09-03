from pydantic import BaseModel, Field

class MenuItemPromotionCreate(BaseModel):

    menu_id: int = Field(
        ...,
        gt=0
    )

    promotion_id: int = Field(
        ...,
        gt=0
    )


class MenuItemPromotionDelete(BaseModel):

    menu_id: int = Field(
        ...,
        gt=0
    )

    promotion_id: int = Field(
        ...,
        gt=0
    )


class MenuIdRequest(BaseModel):

    menu_id: int = Field(
        ...,
        gt=0
    )


class PromotionIdRequest(BaseModel):

    promotion_id: int = Field(
        ...,
        gt=0
    )