from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.message_schemas import (
    CreateMessageSchema,
    UpdateMessageSchema
)

from app.services.message_service import (
    create_message_service,
    get_messages_service,
    get_message_by_id_service,
    get_messages_by_conversation_service,
    update_message_service,
    mark_message_read_service,
    mark_conversation_read_service,
    delete_message_service,
    delete_messages_by_conversation_service,
    restore_message_service
)

router = APIRouter(
    prefix="/messages",
    tags=["Messages"]
)


# 🔹 CREATE
@router.post("")
def create_message(
    payload: CreateMessageSchema,
    db: Session = Depends(get_db)
):
    result = create_message_service(db, payload)

    return {
        "success": True,
        "message": "Message sent successfully",
        "data": result
    }


# 🔹 GET ALL
@router.get("")
def get_messages(
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "data": get_messages_service(db)
    }


# 🔹 GET BY CONVERSATION
@router.get("/conversation/{conversation_id}")
def get_messages_by_conversation(
    conversation_id: int,
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "data": get_messages_by_conversation_service(db, conversation_id)
    }


# 🔹 MARK CONVERSATION AS READ
@router.patch("/conversation/{conversation_id}/read")
def mark_conversation_read(
    conversation_id: int,
    db: Session = Depends(get_db)
):
    result = mark_conversation_read_service(db, conversation_id)

    return {
        "success": True,
        "message": "Conversation marked as read",
        "data": result
    }


# 🔹 RESTORE
@router.patch("/restore/{message_id}")
def restore_message(
    message_id: int,
    db: Session = Depends(get_db)
):
    result = restore_message_service(db, message_id)

    return {
        "success": True,
        "message": "Message restored successfully",
        "data": result
    }


# 🔹 GET BY ID
@router.get("/{message_id}")
def get_message_by_id(
    message_id: int,
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "data": get_message_by_id_service(db, message_id)
    }


# 🔹 UPDATE
@router.put("/{message_id}")
def update_message(
    message_id: int,
    payload: UpdateMessageSchema,
    db: Session = Depends(get_db)
):
    result = update_message_service(db, message_id, payload)

    return {
        "success": True,
        "message": "Message updated successfully",
        "data": result
    }


# 🔹 MARK SINGLE MESSAGE AS READ
@router.patch("/{message_id}/read")
def mark_message_read(
    message_id: int,
    db: Session = Depends(get_db)
):
    result = mark_message_read_service(db, message_id)

    return {
        "success": True,
        "message": "Message marked as read",
        "data": result
    }


# 🔹 DELETE SINGLE
@router.delete("/{message_id}")
def delete_message(
    message_id: int,
    db: Session = Depends(get_db)
):
    result = delete_message_service(db, message_id)

    return {
        "success": True,
        "message": "Message deleted successfully",
        "data": result
    }


# 🔹 DELETE BY CONVERSATION
@router.delete("/conversation/{conversation_id}")
def delete_messages_by_conversation(
    conversation_id: int,
    db: Session = Depends(get_db)
):
    result = delete_messages_by_conversation_service(db, conversation_id)

    return {
        "success": True,
        "message": "Messages deleted successfully",
        "data": result
    }