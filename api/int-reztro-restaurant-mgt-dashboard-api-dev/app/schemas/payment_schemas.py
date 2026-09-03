from typing import Literal
from pydantic import BaseModel, Field


class PaymentCreate(BaseModel):

    payment_method: Literal[
        "Cash",
        "Card",
        "UPI",
        "Online"
    ]

    payment_status: Literal[
        "Pending",
        "Paid",
        "Failed",
        "Refunded"
    ] = "Pending"

    # paid_amount: float = Field(..., ge=0)

    transaction_id: str | None = None


class PaymentUpdate(BaseModel):

    payment_method: Literal[
        "Cash",
        "Card",
        "UPI",
        "Online"
    ]

    payment_status: Literal[
        "Pending",
        "Paid",
        "Failed",
        "Refunded"
    ]

    # paid_amount: float = Field(..., ge=0)

    transaction_id: str | None = None


class PaymentStatusUpdate(BaseModel):

    payment_status: Literal[
        "Pending",
        "Paid",
        "Failed",
        "Refunded"
    ]

    transaction_id: str | None = None