from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def create_promotion_service(db, payload):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.AddPromotion
                    @promotion_title = :promotion_title,
                    @promotion_code = :promotion_code,
                    @discount_type = :discount_type,
                    @discount_value = :discount_value,
                    @start_date = :start_date,
                    @end_date = :end_date,
                    @min_order_amount = :min_order_amount,
                    @max_discount_amount = :max_discount_amount
            """),
            payload.model_dump()
        )

        rows = result.mappings().all()
        promotion = rows[0] if rows else None

        db.commit()

        return promotion

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


def get_promotions_service(db):

    result = db.execute(
        text("EXEC Reztro.GetPromotions")
    )

    return result.mappings().all()


def get_promotion_by_id_service(db, promotion_id):

    result = db.execute(
        text("""
            EXEC Reztro.GetPromotionById
                @promotion_id = :promotion_id
        """),
        {"promotion_id": promotion_id}
    )

    rows = result.mappings().all()
    return rows[0] if rows else None


def get_promotion_by_code_service(db, promotion_code):

    result = db.execute(
        text("""
            EXEC Reztro.GetPromotionByCode
                @promotion_code = :promotion_code
        """),
        {"promotion_code": promotion_code}
    )

    rows = result.mappings().all()
    return rows[0] if rows else None


def get_active_promotions_service(db):

    result = db.execute(
        text("EXEC Reztro.GetActivePromotions")
    )

    return result.mappings().all()


def update_promotion_service(
    db,
    promotion_id,
    payload
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.UpdatePromotion
                    @promotion_id = :promotion_id,
                    @promotion_title = :promotion_title,
                    @promotion_code = :promotion_code,
                    @discount_type = :discount_type,
                    @discount_value = :discount_value,
                    @start_date = :start_date,
                    @end_date = :end_date,
                    @min_order_amount = :min_order_amount,
                    @max_discount_amount = :max_discount_amount
            """),
            {
                "promotion_id": promotion_id,
                **payload.model_dump()
            }
        )

        rows = result.mappings().all()
        promotion = rows[0] if rows else None

        db.commit()

        return promotion

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


def delete_promotion_service(
    db,
    promotion_id
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.DeletePromotion
                    @promotion_id = :promotion_id
            """),
            {"promotion_id": promotion_id}
        )

        rows = result.mappings().all()
        data = rows[0] if rows else None

        db.commit()

        return data

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


def restore_promotion_service(db, promotion_id):
    try:

        result = db.execute(
            text("""
                EXEC Reztro.RestorePromotion
                    @promotion_id = :promotion_id
            """),
            {"promotion_id": promotion_id}
        )

        rows = result.mappings().all()
        data = rows[0] if rows else None

        db.commit()

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(e.orig)
        )


def calculate_promotion_discount_service(
    db,
    payload
):

    result = db.execute(
        text("""
            EXEC Reztro.CalculatePromotionDiscount
                @promotion_code = :promotion_code,
                @order_amount = :order_amount
        """),
        payload.model_dump()
    )

    rows = result.mappings().all()
    return rows[0] if rows else None