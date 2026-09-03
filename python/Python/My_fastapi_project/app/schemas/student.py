from pydantic import BaseModel

class Student(BaseModel):
    id: int | None = None
    fullName: str
    email: str
    phone: str
    dob: str
    gender: str
    course: str
    address: str