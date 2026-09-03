from datetime import datetime

from pydantic import (
    BaseModel,
    Field
)

class OnlineOrderCreate(BaseModel):

    driver_id: int | None = None

    delivery_address: str = Field(
        ...,
        min_length=3,
        max_length=500
    )

    delivery_latitude: float | None = None

    delivery_longitude: float | None = None

    restaurant_address: str | None = Field(
        None,
        max_length=500
    )

    restaurant_latitude: float | None = None

    restaurant_longitude: float | None = None

    delivery_time: datetime | None = None



class OnlineOrderUpdate(BaseModel):

    driver_id: int | None = None

    delivery_address: str = Field(
        ...,
        min_length=3,
        max_length=500
    )

    delivery_latitude: float | None = None

    delivery_longitude: float | None = None

    restaurant_address: str | None = Field(
        None,
        max_length=500
    )

    restaurant_latitude: float | None = None

    restaurant_longitude: float | None = None

    delivery_time: datetime | None = None
