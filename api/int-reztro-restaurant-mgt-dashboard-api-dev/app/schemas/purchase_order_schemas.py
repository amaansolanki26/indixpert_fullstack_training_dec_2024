from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field 


class PurchaseOrderCreate(BaseModel):

    inventory_id: int = Field(..., gt=0)

    po_no: str = Field(..., min_length=1, max_length=50)

    vendor_supplier: str | None = Field(None, max_length=150)

    price: Decimal = Field(..., ge=0)

    quantity: int = Field(..., gt=0)

    order_status: str = Field(default="Pending")

    delivery_progress: int = Field(default=0, ge=0, le=100)

    arrival_date: datetime | None = None


class PurchaseOrderUpdate(BaseModel):

    inventory_id: int | None = Field(None, gt=0)

    po_no: str | None = Field(None, min_length=1, max_length=50)

    vendor_supplier: str | None = Field(None, max_length=150)

    price: Decimal | None = Field(None, ge=0)

    quantity: int | None = Field(None, gt=0)

    order_status: str | None = None

    delivery_progress: int | None = Field(None, ge=0, le=100)

    arrival_date: datetime | None = None


class PurchaseOrderStatusUpdate(BaseModel):

    order_status: str

    delivery_progress: int = Field(..., ge=0, le=100)

    arrival_date: datetime | None = None


class PurchaseOrderDeliver(BaseModel):

    note: str | None = Field(None, max_length=255)
