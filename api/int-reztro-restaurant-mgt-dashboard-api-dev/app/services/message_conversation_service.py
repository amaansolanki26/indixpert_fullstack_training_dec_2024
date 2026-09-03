from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def safe_fetch_one(result):
    try:
        return result.mappings().first()
    except Exception:
            return None


# CREATE


def create_conversation_service(db, payload):
    try:

        result = db.execute(
            text("""
                EXEC Reztro.AddMessageConversation
                    @participant_name=:participant_name,
                    @participant_role=:participant_role,
                    @customer_id=:customer_id,
                    @admin_id=:admin_id,
                    @avatar_url=:avatar_url,
                    @avatar_text=:avatar_text,
                    @is_online=:is_online
            """),
            payload.model_dump(),
        )

        response = safe_fetch_one(result)

        db.commit()

        return response

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(status_code=400, detail=str(getattr(e, "orig", e)))


# GET ALL


def get_conversations_service(db):
    try:

        result = db.execute(text("EXEC Reztro.GetMessageConversations"))

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(status_code=500, detail=str(getattr(e, "orig", e)))


# GET BY ID


def get_conversation_by_id_service(db, conversation_id: int):
    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetMessageConversationById
                    @conversation_id=:conversation_id
            """),
            {"conversation_id": conversation_id},
        )

        data = safe_fetch_one(result)

        if not data:
            raise HTTPException(status_code=404, detail="Conversation not found")

        return data

    except SQLAlchemyError as e:

        raise HTTPException(status_code=400, detail=str(getattr(e, "orig", e)))


# UPDATE


def update_conversation_service(db, conversation_id: int, payload):
    try:

        params = payload.model_dump()

        params["conversation_id"] = conversation_id

        result = db.execute(
            text("""
                EXEC Reztro.UpdateMessageConversation
                    @conversation_id=:conversation_id,
                    @participant_name=:participant_name,
                    @participant_role=:participant_role,
                    @customer_id=:customer_id,
                    @admin_id=:admin_id,
                    @avatar_url=:avatar_url,
                    @avatar_text=:avatar_text,
                    @is_online=:is_online,
                    @is_read=:is_read
            """),
            params,
        )

        response = safe_fetch_one(result)

        db.commit()

        return response

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(status_code=400, detail=str(getattr(e, "orig", e)))


# UPDATE ONLINE STATUS


def update_conversation_online_status_service(
    db, conversation_id: int, is_online: bool
):
    try:

        result = db.execute(
            text("""
                EXEC Reztro.UpdateConversationOnlineStatus
                    @conversation_id=:conversation_id,
                    @is_online=:is_online
            """),
            {"conversation_id": conversation_id, "is_online": is_online},
        )

        response = safe_fetch_one(result)

        db.commit()

        return response

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(status_code=400, detail=str(getattr(e, "orig", e)))


# MARK AS READ


def mark_conversation_read_service(db, conversation_id: int):
    try:

        result = db.execute(
            text("""
                EXEC Reztro.MarkConversationAsRead
                    @conversation_id=:conversation_id
            """),
            {"conversation_id": conversation_id},
        )

        response = safe_fetch_one(result)

        db.commit()

        return response

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(status_code=400, detail=str(getattr(e, "orig", e)))


# DELETE


def delete_conversation_service(db, conversation_id: int):
    try:

        result = db.execute(
            text("""
                EXEC Reztro.DeleteMessageConversation
                    @conversation_id=:conversation_id
            """),
            {"conversation_id": conversation_id},
        )

        response = safe_fetch_one(result)

        db.commit()

        return response

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(status_code=400, detail=str(getattr(e, "orig", e)))


# RESTORE


def restore_conversation_service(db, conversation_id: int):
    try:

        result = db.execute(
            text("""
                EXEC Reztro.RestoreMessageConversation
                    @conversation_id=:conversation_id
            """),
            {"conversation_id": conversation_id},
        )

        response = safe_fetch_one(result)

        db.commit()

        return response

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(status_code=400, detail=str(getattr(e, "orig", e)))
