from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.customer_schemas import CustomerCreate, CustomerUpdate 

from app.services.customer_service import (
    create_customer_service,
    get_customers_service,
    get_customer_by_id_service,
    update_customer_service,
    delete_customer_service
)

from app.utils.cloudinary import upload_to_cloudinary


router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.post("")
async def create_customer(
    full_name: str = Form(...),
    email: str = Form(None),
    phone: str = Form(None),
    address: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    profile_image_url = None

    if file:
        upload_result = upload_to_cloudinary(file)
        profile_image_url = upload_result["url"]

    payload = CustomerCreate(
        full_name=full_name,
        email=email,
        phone=phone,
        address=address,
        profile_image_url=profile_image_url
    )

    customer = create_customer_service(db, payload)

    return {
        "success": True,
        "message": "Customer created successfully",
        "data": customer
    }


@router.get("")
def get_customers(db: Session = Depends(get_db)):  
    customers = get_customers_service(db)

    return {
        "success": True,
        "count": len(customers),
        "data": customers
    }


@router.get("/{customer_id}")
def get_customer_by_id(customer_id: int, db: Session = Depends(get_db)):  
    customer = get_customer_by_id_service(db, customer_id)

    return {
        "success": True,
        "data": customer
    }


@router.put("/{customer_id}")
async def update_customer(
    customer_id: int,
    full_name: str = Form(...),
    email: str = Form(None),
    phone: str = Form(None),
    address: str = Form(None),
    profile_image_url: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    profile_image_url = None
 
    if file:
        upload_result = upload_to_cloudinary(file)
        profile_image_url = upload_result["url"]
 
    payload = CustomerUpdate(
        full_name=full_name,
        email=email,
        phone=phone,
        address=address,
        profile_image_url=profile_image_url
    )
 
    update_customer_service(db, customer_id, payload)
 
    return {
        "success": True,
        "message": "Customer updated successfully"
    }

@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):  
    delete_customer_service(db, customer_id)

    return {
        "success": True,
        "message": "Customer deleted successfully"
    }