from pydantic import (
    BaseModel,
    Field
)


class DriverLocationCreate(BaseModel):

    driver_id: int = Field(..., gt=0)

    current_latitude: float

    current_longitude: float