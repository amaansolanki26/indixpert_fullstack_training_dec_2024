from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


# CREATE TAG

def create_tag_service(db, payload):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.AddTag
                    @tag_name = :tag_name
            """),
            payload.model_dump()
        )

        tag = result.mappings().first()

        db.commit()

        return tag

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


# GET TAGS

def get_tags_service(db):

    result = db.execute(
        text("EXEC Reztro.GetTags")
    )

    return result.mappings().all()


# GET TAG BY ID

def get_tag_by_id_service(
    db,
    tag_id: int
):

    result = db.execute(
        text("""
            EXEC Reztro.GetTagById
                @tag_id = :tag_id
        """),
        {"tag_id": tag_id}
    )

    tag = result.mappings().first()

    return tag


# UPDATE TAG

def update_tag_service(
    db,
    tag_id: int,
    payload
):

    try:

        db.execute(
            text("""
                EXEC Reztro.UpdateTag
                    @tag_id = :tag_id,
                    @tag_name = :tag_name
            """),
            {
                "tag_id": tag_id,
                **payload.model_dump()
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


# DELETE TAG

def delete_tag_service(
    db,
    tag_id: int
):

    try:

        db.execute(
            text("""
                EXEC Reztro.DeleteTag
                    @tag_id = :tag_id
            """),
            {"tag_id": tag_id}
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


# RESTORE TAG

def restore_tag_service(
    db,
    tag_id: int
):

    try:

        db.execute(
            text("""
                EXEC Reztro.RestoreTag
                    @tag_id = :tag_id
            """),
            {"tag_id": tag_id}
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )