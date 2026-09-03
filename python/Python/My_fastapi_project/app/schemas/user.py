from pydantic import BaseModel

class UserSchema(BaseModel):
    name: str
    email: str
    picture: str | None = None
    sub: str | None = None


class UserUpdate(BaseModel):
    name: str
    email: str
    contact: str
    state: str
    city: str 