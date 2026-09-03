from pydantic import BaseModel, Field
from typing import Optional, Literal


class StockMovementCreate(BaseModel):
    inventory_id: int = Field(..., gt=0, description="Must be a valid positive inventory ID")

    movement_type: Literal["Stock In", "Stock Out", "Adjustment"]

    quantity: int = Field(
        ...,
        ge=0,
        description="Quantity must be 0 or greater"
    )

    note: Optional[str] = Field(
        None,
        max_length=255,
        description="Optional note (max 255 characters)"
    )

class StockHistoryByInventoryRequest(BaseModel):
    inventory_id: int = Field(..., gt=0)


class StockHistoryByIdRequest(BaseModel):
    stock_history_id: int = Field(..., gt=0)