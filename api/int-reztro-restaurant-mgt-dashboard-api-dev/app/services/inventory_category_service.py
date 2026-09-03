from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


# 🔹 CREATE
def create_inventory_category_service(db, payload):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.AddInventoryCategory
                    @category_name=:category_name
            """),
            payload.model_dump()
        )

        try:
            data = result.mappings().first()
        except:
            data = None

        db.commit()

        if data is None:
            raise HTTPException(
                status_code=400,
                detail="Category not created"
            )

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET ALL
def get_inventory_categories_service(db):
    try:
        result = db.execute(
            text("EXEC Reztro.GetInventoryCategories")
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET BY ID
def get_inventory_category_by_id_service(db, inventory_category_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetInventoryCategoryById
                    @inventory_category_id=:inventory_category_id
            """),
            {"inventory_category_id": inventory_category_id}
        )

        try:
            item = result.mappings().first()
        except:
            item = None

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )

        return item

    except HTTPException:
        raise

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 UPDATE
def update_inventory_category_service(db, inventory_category_id: int, payload):
    try:
        params = payload.model_dump()
        params["inventory_category_id"] = inventory_category_id

        result = db.execute(
            text("""
                EXEC Reztro.UpdateInventoryCategory
                    @inventory_category_id=:inventory_category_id,
                    @category_name=:category_name
            """),
            params
        )

        try:
            data = result.mappings().first()
        except:
            data = None

        db.commit()

        if data is None:
            raise HTTPException(
                status_code=400,
                detail="Update failed"
            )

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 DELETE
def delete_inventory_category_service(db, inventory_category_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.DeleteInventoryCategory
                    @inventory_category_id=:inventory_category_id
            """),
            {"inventory_category_id": inventory_category_id}
        )

        try:
            data = result.mappings().first()
        except:
            data = None

        db.commit()

        if data is None:
            raise HTTPException(
                status_code=400,
                detail="Delete failed"
            )

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 RESTORE
def restore_inventory_category_service(db, inventory_category_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.RestoreInventoryCategory
                    @inventory_category_id=:inventory_category_id
            """),
            {"inventory_category_id": inventory_category_id}
        )

        try:
            data = result.mappings().first()
        except:
            data = None

        db.commit()

        if data is None:
            raise HTTPException(
                status_code=400,
                detail="Restore failed"
            )

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(getattr(e, "orig", e))
        )