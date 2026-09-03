from typing import Literal

from pydantic import (
    BaseModel,
    Field,
    EmailStr
)


class DriverCreate(BaseModel):

    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    phone: str | None = Field(
        None,
        max_length=20
    )

    email: EmailStr | None = None

    profile_image_url: str | None = Field(
        None,
        max_length=500
    )

    vehicle_type: str | None = Field(
        None,
        max_length=100
    )

    vehicle_number: str | None = Field(
        None,
        max_length=50
    )

    status: Literal[
        "Online",
        "Offline",
        "Busy"
    ] = "Offline"


class DriverUpdate(BaseModel):

    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    phone: str | None = Field(
        None,
        max_length=20
    )

    email: EmailStr | None = None

    profile_image_url: str | None = Field(
        None,
        max_length=500
    )

    vehicle_type: str | None = Field(
        None,
        max_length=100
    )

    vehicle_number: str | None = Field(
        None,
        max_length=50
    )

    status: Literal[
        "Online",
        "Offline",
        "Busy"
    ] = "Offline"


class DriverStatusUpdate(BaseModel):

    status: Literal[
        "Online",
        "Offline",
        "Busy"
    ]