from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def safe_fetch_one(result):
    try:
        return result.mappings().first()
    except Exception:
        return None


# 🔹 CREATE
def create_message_service(db, payload):
    try:
        data = payload.model_dump()

        result = db.execute(
            text("""
                EXEC Reztro.AddMessage
                    @conversation_id=:conversation_id,
                    @sender_id=:sender_id,
                    @sender_type=:sender_type,
                    @message_type=:message_type,
                    @message_text=:message_text,
                    @attachment_url=:attachment_url,
                    @attachment_type=:attachment_type
            """),
            data
        )

        response = safe_fetch_one(result)
        db.commit()

        if response and response.get("success") == 0:
            raise HTTPException(status_code=400, detail=response.get("message"))

        return response

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET ALL
def get_messages_service(db):
    try:
        result = db.execute(text("EXEC Reztro.GetMessages"))
        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET BY ID
def get_message_by_id_service(db, message_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetMessageById
                    @message_id=:message_id
            """),
            {"message_id": message_id}
        )

        data = safe_fetch_one(result)

        if not data:
            raise HTTPException(status_code=404, detail="Message not found")

        return data

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 GET BY CONVERSATION
def get_messages_by_conversation_service(db, conversation_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetMessagesByConversationId
                    @conversation_id=:conversation_id
            """),
            {"conversation_id": conversation_id}
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 UPDATE
def update_message_service(db, message_id: int, payload):
    try:
        params = payload.model_dump()
        params["message_id"] = message_id

        result = db.execute(
            text("""
                EXEC Reztro.UpdateMessage
                    @message_id=:message_id,
                    @message_text=:message_text,
                    @message_type=:message_type,
                    @attachment_url=:attachment_url,
                    @attachment_type=:attachment_type
            """),
            params
        )

        response = safe_fetch_one(result)
        db.commit()

        if response and response.get("success") == 0:
            raise HTTPException(status_code=400, detail=response.get("message"))

        return response

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 MARK MESSAGE AS READ
def mark_message_read_service(db, message_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.MarkMessageAsRead
                    @message_id=:message_id
            """),
            {"message_id": message_id}
        )

        data = safe_fetch_one(result)
        db.commit()

        if not data:
            raise HTTPException(status_code=404, detail="Message not found")

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 MARK CONVERSATION AS READ
def mark_conversation_read_service(db, conversation_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.MarkConversationMessagesAsRead
                    @conversation_id=:conversation_id
            """),
            {"conversation_id": conversation_id}
        )

        data = safe_fetch_one(result)
        db.commit()

        if not data:
            raise HTTPException(status_code=404, detail="Conversation not found")

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 DELETE SINGLE (SOFT)
def delete_message_service(db, message_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.DeleteMessage
                    @message_id=:message_id
            """),
            {"message_id": message_id}
        )

        data = safe_fetch_one(result)
        db.commit()

        if not data:
            raise HTTPException(status_code=404, detail="Message not found")

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 DELETE BY CONVERSATION
def delete_messages_by_conversation_service(db, conversation_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.DeleteMessagesByConversationId
                    @conversation_id=:conversation_id
            """),
            {"conversation_id": conversation_id}
        )

        data = safe_fetch_one(result)
        db.commit()

        if not data:
            raise HTTPException(status_code=404, detail="No messages found")

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


# 🔹 RESTORE
def restore_message_service(db, message_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.RestoreMessage
                    @message_id=:message_id
            """),
            {"message_id": message_id}
        )

        data = safe_fetch_one(result)
        db.commit()

        if not data:
            raise HTTPException(status_code=404, detail="Message not found")

        return data

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )