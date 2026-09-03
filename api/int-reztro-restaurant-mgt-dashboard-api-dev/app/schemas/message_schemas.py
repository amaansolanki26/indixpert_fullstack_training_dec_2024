from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CreateMessageSchema(BaseModel):
    conversation_id: int = Field(..., gt=0)

    sender_id: str = Field(..., min_length=1, max_length=50)
    sender_type: str = Field(..., min_length=1, max_length=50)

    message_type: str = Field(default="text", pattern="^(text|image|file)$")

    message_text: str = Field(..., min_length=1)

    attachment_url: Optional[str] = Field(default=None, max_length=500)
    attachment_type: Optional[str] = Field(default=None, max_length=100)


class UpdateMessageSchema(BaseModel):
    message_type: str = Field(default="text", pattern="^(text|image|file)$")

    message_text: str = Field(..., min_length=1)

    attachment_url: Optional[str] = Field(default=None, max_length=500)
    attachment_type: Optional[str] = Field(default=None, max_length=100)


class MessageResponseSchema(BaseModel):
    message_id: int
    conversation_id: int

    sender_id: str
    sender_type: str

    message_type: str
    message_text: str

    attachment_url: Optional[str]
    attachment_type: Optional[str]

    is_read: bool
    is_active: Optional[bool]

    sent_at: datetime
    created_at: datetime
