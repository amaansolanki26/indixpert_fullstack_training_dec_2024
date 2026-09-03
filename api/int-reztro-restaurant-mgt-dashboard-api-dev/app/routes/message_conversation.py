from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.message_conversation_schemas import (
    CreateConversationSchema,
    UpdateConversationSchema,
    ConversationOnlineStatusSchema,
)

from app.services.message_conversation_service import (
    create_conversation_service,
    get_conversations_service,
    get_conversation_by_id_service,
    update_conversation_service,
    update_conversation_online_status_service,
    mark_conversation_read_service,
    delete_conversation_service,
    restore_conversation_service,
)

router = APIRouter(prefix="/message-conversations", tags=["Message Conversations"])

# CREATE


@router.post("")
def create_conversation(
    payload: CreateConversationSchema, db: Session = Depends(get_db)
):
    result = create_conversation_service(db, payload)

    return {
        "success": True,
        "message": "Conversation created successfully",
        "data": result,
    }


# GET ALL


@router.get("")
def get_conversations(db: Session = Depends(get_db)):
    return {"success": True, "data": get_conversations_service(db)}


# MARK AS READ


@router.patch("/{conversation_id}/read")
def mark_conversation_read(conversation_id: int, db: Session = Depends(get_db)):
    result = mark_conversation_read_service(db, conversation_id)

    return {"success": True, "message": "Conversation marked as read", "data": result}


# UPDATE ONLINE STATUS


@router.patch("/{conversation_id}/online-status")
def update_online_status(
    conversation_id: int,
    payload: ConversationOnlineStatusSchema,
    db: Session = Depends(get_db),
):
    result = update_conversation_online_status_service(
        db, conversation_id, payload.is_online
    )

    return {
        "success": True,
        "message": "Conversation status updated successfully",
        "data": result,
    }


# RESTORE


@router.patch("/restore/{conversation_id}")
def restore_conversation(conversation_id: int, db: Session = Depends(get_db)):
    result = restore_conversation_service(db, conversation_id)

    return {
        "success": True,
        "message": "Conversation restored successfully",
        "data": result,
    }


# GET BY ID


@router.get("/{conversation_id}")
def get_conversation_by_id(conversation_id: int, db: Session = Depends(get_db)):
    return {
        "success": True,
        "data": get_conversation_by_id_service(db, conversation_id),
    }


# UPDATE


@router.put("/{conversation_id}")
def update_conversation(
    conversation_id: int,
    payload: UpdateConversationSchema,
    db: Session = Depends(get_db),
):
    result = update_conversation_service(db, conversation_id, payload)

    return {
        "success": True,
        "message": "Conversation updated successfully",
        "data": result,
    }


# DELETE


@router.delete("/{conversation_id}")
def delete_conversation(conversation_id: int, db: Session = Depends(get_db)):
    result = delete_conversation_service(db, conversation_id)

    return {
        "success": True,
        "message": "Conversation deleted successfully",
        "data": result,
    }
