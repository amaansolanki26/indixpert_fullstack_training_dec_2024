from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def create_menu_category_service(db, payload):
    try:
        data = payload if isinstance(payload, dict) else payload.model_dump()

        db.execute(
            text("""
                EXEC Reztro.AddMenuCategory
                    @category_name=:category_name
            """),
            data
        )

        db.commit()

    except SQLAlchemyError as e:
        db.rollback()

        error_message = str(e.orig)

        if "duplicate" in error_message.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Menu category already exists"
            )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_message
        )


def get_menu_categories_service(
    db
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetMenuCategories
            """)
        )

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def get_menu_category_by_id_service(
    db,
    category_id: int
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetMenuCategoryById
                    @category_id=:category_id
            """),
            {
                "category_id": category_id
            }
        )

        category = result.mappings().first()

        if not category:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Menu category not found"
            )

        return category

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def update_menu_category_service(db, category_id: int, payload):
    try:
        data = payload if isinstance(payload, dict) else payload.model_dump(exclude_unset=True)

        if not data or "category_name" not in data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="category_name is required"
            )

        data["category_id"] = category_id

        db.execute(
            text("""
                EXEC Reztro.UpdateMenuCategory
                    @category_id=:category_id,
                    @category_name=:category_name
            """),
            data
        )

        db.commit()

    except HTTPException:
        raise

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )

def delete_menu_category_service(
    db,
    category_id: int
):

    try:

        db.execute(
            text("""
                EXEC Reztro.DeleteMenuCategory
                    @category_id=:category_id
            """),
            {
                "category_id": category_id
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def restore_menu_category_service(
    db,
    category_id: int
):

    try:

        db.execute(
            text("""
                EXEC Reztro.RestoreMenuCategory
                    @category_id=:category_id
            """),
            {
                "category_id": category_id
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )