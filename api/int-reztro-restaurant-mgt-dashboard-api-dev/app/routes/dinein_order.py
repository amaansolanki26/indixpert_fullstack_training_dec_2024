from fastapi import APIRouter, Depends

from app.db.database import get_db

from app.schemas.dinein_order_schemas import DineInOrderUpdate

from app.services.dinein_order_service import (
    get_dine_in_orders_service,
    get_dine_in_by_id_service,
    get_dine_in_by_order_id_service,
    update_dine_in_service,
    delete_dine_in_service,
)

router = APIRouter(prefix="/dine-in-orders", tags=["Dine-In Orders"])


@router.get("")
def get_dine_in_orders(db=Depends(get_db)):

    data = get_dine_in_orders_service(db)

    return {"success": True, "count": len(data), "data": data}


@router.get("/{dine_in_id}")
def get_dine_in_by_id(dine_in_id: int, db=Depends(get_db)):

    data = get_dine_in_by_id_service(db, dine_in_id)

    return {"success": True, "data": data}


@router.get("/order/{order_id}")
def get_dine_in_by_order_id(order_id: int, db=Depends(get_db)):

    data = get_dine_in_by_order_id_service(db, order_id)

    return {"success": True, "data": data}


@router.put("/{dine_in_id}")
def update_dine_in(dine_in_id: int, payload: DineInOrderUpdate, db=Depends(get_db)):

    update_dine_in_service(db, dine_in_id, payload)

    return {"success": True, "message": "Dine-In details updated successfully"}


@router.delete("/{dine_in_id}")
def delete_dine_in(dine_in_id: int, db=Depends(get_db)):

    delete_dine_in_service(db, dine_in_id)

    return {"success": True, "message": "Dine-In details deleted successfully"}
