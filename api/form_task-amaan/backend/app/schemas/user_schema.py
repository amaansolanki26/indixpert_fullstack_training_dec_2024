from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


class Address(BaseModel):
    address: str
    city: str
    state: str
    country: str
    zipCode: str


class PersonalInfo(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: str
    dob: str                   
    gender: str

    address: Address             

class CompanyInfo(BaseModel):
    companyName: str
    designation: str
    department: str
    companyEmail: EmailStr
    website: Optional[str] = None
    gstNumber: Optional[str] = None

    address: Address         


class UserRegistration(BaseModel):
    personal: PersonalInfo
    company: Optional[CompanyInfo] = None   