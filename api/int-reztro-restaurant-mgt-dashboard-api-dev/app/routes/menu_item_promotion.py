from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.menu_item_promotion_schemas import (
    MenuItemPromotionCreate,
    MenuItemPromotionDelete
)

from app.services.menu_item_promotion_service import (
    add_menu_item_promotion_service,
    get_menu_item_promotions_service,
    get_promotions_by_menu_id_service,
    get_active_promotions_by_menu_id_service,
    get_menu_items_by_promotion_id_service,
    remove_menu_item_promotion_service,
    remove_all_promotions_from_menu_item_service,
    remove_promotion_from_all_menu_items_service
)

router = APIRouter(
    prefix="/menu-item-promotions",
    tags=["Menu Item Promotions"]
)


@router.post("")
def add_menu_item_promotion(
    payload: MenuItemPromotionCreate,
    db: Session = Depends(get_db)
):

    result = add_menu_item_promotion_service(
        db,
        payload
    )

    return {
        "success": True,
        "message": "Promotion assigned successfully",
        "data": result
    }


@router.get("")
def get_menu_item_promotions(
    db: Session = Depends(get_db)
):

    promotions = get_menu_item_promotions_service(db)

    return {
        "success": True,
        "data": promotions
    }


@router.get("/menu/{menu_id}")
def get_promotions_by_menu_id(
    menu_id: int,
    db: Session = Depends(get_db)
):

    promotions = get_promotions_by_menu_id_service(
        db,
        menu_id
    )

    return {
        "success": True,
        "data": promotions
    }


@router.get("/menu/{menu_id}/active")
def get_active_promotions_by_menu_id(
    menu_id: int,
    db: Session = Depends(get_db)
):

    promotions = get_active_promotions_by_menu_id_service(
        db,
        menu_id
    )

    return {
        "success": True,
        "data": promotions
    }


@router.get("/promotion/{promotion_id}")
def get_menu_items_by_promotion_id(
    promotion_id: int,
    db: Session = Depends(get_db)
):

    menu_items = get_menu_items_by_promotion_id_service(
        db,
        promotion_id
    )

    return {
        "success": True,
        "data": menu_items
    }


@router.delete("")
def remove_menu_item_promotion(
    payload: MenuItemPromotionDelete,
    db: Session = Depends(get_db)
):

    result = remove_menu_item_promotion_service(
        db,
        payload
    )

    return {
        "success": True,
        "message": "Promotion removed successfully",
        "data": result
    }


@router.delete("/menu/{menu_id}")
def remove_all_promotions_from_menu_item(
    menu_id: int,
    db: Session = Depends(get_db)
):

    result = remove_all_promotions_from_menu_item_service(
        db,
        menu_id
    )

    return {
        "success": True,
        "message": "All promotions removed from menu item",
        "data": result
    }


@router.delete("/promotion/{promotion_id}")
def remove_promotion_from_all_menu_items(
    promotion_id: int,
    db: Session = Depends(get_db)
):

    result = remove_promotion_from_all_menu_items_service(
        db,
        promotion_id
    )

    return {
        "success": True,
        "message": "Promotion removed from all menu items",
        "data": result
    }