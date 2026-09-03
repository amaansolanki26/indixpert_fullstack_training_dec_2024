from fastapi import APIRouter, Depends

from app.db.database import get_db

from app.schemas.tag_schemas import (
    TagCreate,
    TagUpdate
)

from app.services.tag_service import (
    create_tag_service,
    get_tags_service,
    get_tag_by_id_service,
    update_tag_service,
    delete_tag_service,
    restore_tag_service
)

router = APIRouter(
    prefix="/tags",
    tags=["Tags"]
)

# CREATE TAG

@router.post("")
def create_tag(
    payload: TagCreate,
    db=Depends(get_db)
):

    tag = create_tag_service(
        db,
        payload
    )

    return {
        "success": True,
        "message": "Tag created successfully",
        "data": tag
    }


# GET TAGS

@router.get("")
def get_tags(
    db=Depends(get_db)
):

    tags = get_tags_service(db)

    return {
        "success": True,
        "count": len(tags),
        "data": tags
    }


# GET TAG BY ID

@router.get("/{tag_id}")
def get_tag_by_id(
    tag_id: int,
    db=Depends(get_db)
):

    tag = get_tag_by_id_service(
        db,
        tag_id
    )

    return {
        "success": True,
        "data": tag
    }


# UPDATE TAG

@router.put("/{tag_id}")
def update_tag(
    tag_id: int,
    payload: TagUpdate,
    db=Depends(get_db)
):

    update_tag_service(
        db,
        tag_id,
        payload
    )

    return {
        "success": True,
        "message": "Tag updated successfully"
    }


# DELETE TAG

@router.delete("/{tag_id}")
def delete_tag(
    tag_id: int,
    db=Depends(get_db)
):

    delete_tag_service(
        db,
        tag_id
    )

    return {
        "success": True,
        "message": "Tag deleted successfully"
    }


# RESTORE TAG

@router.patch("/{tag_id}/restore")
def restore_tag(
    tag_id: int,
    db=Depends(get_db)
):

    restore_tag_service(
        db,
        tag_id
    )

    return {
        "success": True,
        "message": "Tag restored successfully"
    }