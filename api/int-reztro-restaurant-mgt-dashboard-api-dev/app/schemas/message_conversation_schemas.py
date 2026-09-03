from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CreateConversationSchema(BaseModel):
    participant_name: str = Field(..., min_length=1, max_length=100)

    participant_role: str = Field(
        ...,
        min_length=1,
        max_length=50
    )

    customer_id: Optional[int] = Field(
        default=None,
        gt=0
    )

    admin_id: Optional[int] = Field(
        default=None,
        gt=0
    )

    avatar_url: Optional[str] = Field(
        default=None,
        max_length=500
    )

    avatar_text: Optional[str] = Field(
        default=None,
        max_length=10
    )

    is_online: bool = False


class UpdateConversationSchema(BaseModel):
    participant_name: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    participant_role: str = Field(
        ...,
        min_length=1,
        max_length=50
    )

    customer_id: Optional[int] = Field(
        default=None,
        gt=0
    )

    admin_id: Optional[int] = Field(
        default=None,
        gt=0
    )

    avatar_url: Optional[str] = Field(
        default=None,
        max_length=500
    )

    avatar_text: Optional[str] = Field(
        default=None,
        max_length=10
    )

    is_online: bool = False

    is_read: bool = True


class ConversationResponseSchema(BaseModel):
    conversation_id: int

    conversation_no: str

    participant_name: str
    participant_role: str

    customer_id: Optional[int]
    admin_id: Optional[int]

    avatar_url: Optional[str]
    avatar_text: Optional[str]

    is_online: bool

    is_active: bool

    last_message: Optional[str]
    last_message_time: Optional[datetime]

    unread_count: int

    is_read: bool

    created_at: datetime
    updated_at: Optional[datetime]
    
class ConversationOnlineStatusSchema(BaseModel):
    is_online: bool