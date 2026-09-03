from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def normalize_payload(payload):
    if payload is None:
        raise HTTPException(status_code=400, detail="Payload cannot be None")

    return payload if isinstance(payload, dict) else payload.model_dump(exclude_unset=True)


def add_menu_item_promotion_service(db, payload):
    try:
        data = normalize_payload(payload)

        result = db.execute(
            text("""
                EXEC Reztro.AddMenuItemPromotion
                    @menu_id = :menu_id,
                    @promotion_id = :promotion_id
            """),
            data
        )

        response = result.mappings().first()

        return response  

    except SQLAlchemyError as e:
        raise HTTPException(  
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


def get_menu_item_promotions_service(db):
    try:
        result = db.execute(text("EXEC Reztro.GetMenuItemPromotions"))
        return result.mappings().all()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e.orig))


def get_promotions_by_menu_id_service(db, payload):
    try:
        data = normalize_payload(payload)

        result = db.execute(
            text("""
                EXEC Reztro.GetPromotionsByMenuId
                    @menu_id = :menu_id
            """),
            data
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(status_code=400, detail=str(e.orig))


def get_active_promotions_by_menu_id_service(db, payload):
    try:
        data = normalize_payload(payload)
        result = db.execute(
            text("""
                EXEC Reztro.GetActivePromotionsByMenuId
                    @menu_id = :menu_id
            """),
            data
        )

        return result.mappings().all()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=400, detail=str(e.orig))

def get_menu_items_by_promotion_id_service(db, promotion_id):

    result = db.execute(
        text("""
            EXEC Reztro.GetMenuItemsByPromotionId
                @promotion_id = :promotion_id
        """),
        {
            "promotion_id": promotion_id
        }
    )

    return result.mappings().all()


def remove_menu_item_promotion_service(db, payload):
    try:
        data = normalize_payload(payload)

        result = db.execute(
            text("""
                EXEC Reztro.RemoveMenuItemPromotion
                    @menu_id = :menu_id,
                    @promotion_id = :promotion_id
            """),
            data
        )

        response = result.mappings().first()

        return response  

    except SQLAlchemyError as e:
        raise HTTPException(  
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


def remove_all_promotions_from_menu_item_service(db, payload):
    try:
        data = normalize_payload(payload)

        result = db.execute(
            text("""
                EXEC Reztro.RemoveAllPromotionsFromMenuItem
                    @menu_id = :menu_id
            """),
            data
        )

        return result.mappings().first()

    except SQLAlchemyError as e:
        raise HTTPException( 
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


def remove_promotion_from_all_menu_items_service(db, promotion_id):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.RemovePromotionFromAllMenuItems
                    @promotion_id = :promotion_id
            """),
            {
                "promotion_id": promotion_id
            }
        )

        response = result.mappings().first()

        return response  

    except SQLAlchemyError as e:
        raise HTTPException(  
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )