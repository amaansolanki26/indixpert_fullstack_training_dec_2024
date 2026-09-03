from pydantic import (
    BaseModel,
    Field
)


class OrderItemCreate(BaseModel):

    order_id: int = Field(..., gt=0)

    menu_id: int = Field(..., gt=0)

    quantity: int = Field(
        ...,
        gt=0
    )

    notes: str | None = Field(
        None,
        max_length=500
    )


class OrderItemUpdate(BaseModel):

    menu_id: int = Field(..., gt=0)

    quantity: int = Field(
        ...,
        gt=0
    )

    notes: str | None = Field(
        None,
        max_length=500
    )