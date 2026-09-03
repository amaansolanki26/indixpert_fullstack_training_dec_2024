from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.promotion_schemas import (
    PromotionCreate,
    PromotionUpdate,
    PromotionDiscountRequest
)

from app.services.promotion_service import (
    create_promotion_service,
    get_promotions_service,
    get_promotion_by_id_service,
    get_promotion_by_code_service,
    get_active_promotions_service,
    update_promotion_service,
    delete_promotion_service,
    restore_promotion_service,
    calculate_promotion_discount_service
)

router = APIRouter(
    prefix="/promotions",
    tags=["Promotions"]
)


@router.post("")
def create_promotion(
    payload: PromotionCreate,
    db: Session = Depends(get_db)
):

    promotion = create_promotion_service(
        db,
        payload
    )

    return {
        "success": True,
        "message": "Promotion created successfully",
        "data": promotion
    }


@router.get("")
def get_promotions(
    db: Session = Depends(get_db)
):

    return {
        "success": True,
        "data": get_promotions_service(db)
    }


@router.get("/{promotion_id}")
def get_promotion_by_id(
    promotion_id: int,
    db: Session = Depends(get_db)
):

    return {
        "success": True,
        "data": get_promotion_by_id_service(
            db,
            promotion_id
        )
    }


@router.get("/code/{promotion_code}")
def get_promotion_by_code(
    promotion_code: str,
    db: Session = Depends(get_db)
):

    return {
        "success": True,
        "data": get_promotion_by_code_service(
            db,
            promotion_code
        )
    }


@router.get("/active/list")
def get_active_promotions(
    db: Session = Depends(get_db)
):

    return {
        "success": True,
        "data": get_active_promotions_service(db)
    }


@router.put("/{promotion_id}")
def update_promotion(
    promotion_id: int,
    payload: PromotionUpdate,
    db: Session = Depends(get_db)
):

    promotion = update_promotion_service(
        db,
        promotion_id,
        payload
    )

    return {
        "success": True,
        "message": "Promotion updated successfully",
        "data": promotion
    }


@router.delete("/{promotion_id}")
def delete_promotion(
    promotion_id: int,
    db: Session = Depends(get_db)
):

    result = delete_promotion_service(
        db,
        promotion_id
    )

    return {
        "success": True,
        "message": "Promotion deleted successfully",
        "data": result
    }


@router.patch("/restore/{promotion_id}")
def restore_promotion(
    promotion_id: int,
    db: Session = Depends(get_db)
):

    result = restore_promotion_service(
        db,
        promotion_id
    )

    return {
        "success": True,
        "message": "Promotion restored successfully",
        "data": result
    }


@router.post("/calculate-discount")
def calculate_discount(
    payload: PromotionDiscountRequest,
    db: Session = Depends(get_db)
):

    result = calculate_promotion_discount_service(
        db,
        payload
    )

    return {
        "success": True,
        "data": result
    }