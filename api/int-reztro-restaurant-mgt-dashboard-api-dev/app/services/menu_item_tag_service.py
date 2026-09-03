from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


#  Add Tag to Menu Item
def add_menu_item_tag_service(db, payload):
    try:
        data = payload if isinstance(payload, dict) else payload.model_dump()

        result = db.execute(
            text("""
                EXEC Reztro.AddMenuItemTag
                    @menu_id=:menu_id,
                    @tag_id=:tag_id
            """),
            data
        )

        return result.mappings().first() 
    except SQLAlchemyError as e:
        raise HTTPException(  
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


#  Get All Menu Item Tags
def get_menu_item_tags_service(db):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetMenuItemTags
            """)
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


#  Get Tags by Menu ID
def get_tags_by_menu_id_service(db, payload):
    try:
        data = payload if isinstance(payload, dict) else payload.model_dump()

        result = db.execute(
            text("""
                EXEC Reztro.GetTagsByMenuId
                    @menu_id=:menu_id
            """),
            data
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


#  Get Menu Items by Tag ID
def get_menu_items_by_tag_id_service(db, payload):
    try:
        data = payload if isinstance(payload, dict) else payload.model_dump()

        result = db.execute(
            text("""
                EXEC Reztro.GetMenuItemsByTagId
                    @tag_id=:tag_id
            """),
            data
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


#  Remove Single Tag from Menu Item
def remove_menu_item_tag_service(db, payload):
    try:
        data = payload if isinstance(payload, dict) else payload.model_dump()

        result = db.execute(
            text("""
                EXEC Reztro.RemoveMenuItemTag
                    @menu_id=:menu_id,
                    @tag_id=:tag_id
            """),
            data
        )

        return result.mappings().first() 

    except SQLAlchemyError as e:
        raise HTTPException(  
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


#  Remove All Tags from Menu Item
def remove_all_tags_from_menu_item_service(db, payload):
    try:
        data = payload if isinstance(payload, dict) else payload.model_dump()

        result = db.execute(
            text("""
                EXEC Reztro.RemoveAllTagsFromMenuItem
                    @menu_id=:menu_id
            """),
            data
        )

        return result.mappings().first()  

    except SQLAlchemyError as e:
        raise HTTPException(  
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )