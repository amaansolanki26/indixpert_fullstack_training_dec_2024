from typing import Optional, Literal, List
from pydantic import BaseModel, Field


class InventoryCategoryRef(BaseModel):

    inventory_category_id: int = Field(..., gt=0)


class InventoryStock(BaseModel):

    stock_status: Literal[
        "Available",
        "Low Stock",
        "Out of Stock"
    ] = "Available"

    qty_in_stock: int = Field(..., ge=0)

    qty_in_reorder: int = Field(..., ge=0)


class InventoryItemCreate(BaseModel):

    category: InventoryCategoryRef

    item_name: str = Field(
        ...,
        min_length=2,
        max_length=150
    )

    image_url: Optional[str] = Field(
        None,
        max_length=500
    )

    unit: Optional[str] = Field(
        None,
        max_length=50
    )

    stock: InventoryStock


class InventoryItemUpdate(BaseModel):

    category: Optional[InventoryCategoryRef] = None

    item_name: Optional[str] = Field(
        None,
        min_length=2,
        max_length=150
    )

    image_url: Optional[str] = Field(
        None,
        max_length=500
    )

    unit: Optional[str] = Field(
        None,
        max_length=50
    )

    stock: Optional[InventoryStock] = None


class InventoryStockUpdate(BaseModel):

    qty_in_stock: int = Field(..., ge=0)

    qty_in_reorder: int = Field(..., ge=0)


class InventoryFilter(BaseModel):

    stock_status: Optional[Literal[
        "Available",
        "Low Stock",
        "Out of Stock"
    ]] = None

    category_id: Optional[int] = Field(None, gt=0)