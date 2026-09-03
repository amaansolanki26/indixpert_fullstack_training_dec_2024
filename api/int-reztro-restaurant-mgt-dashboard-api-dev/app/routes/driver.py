from fastapi import APIRouter, Depends, UploadFile, File, Form
from app.db.database import get_db

from app.schemas.driver_schemas import (
    DriverStatusUpdate
)

from app.services.driver_service import (
    create_driver_service,
    get_drivers_service,
    get_driver_by_id_service,
    update_driver_service,
    update_driver_status_service,
    delete_driver_service
)

from app.utils.cloudinary import upload_to_cloudinary  

router = APIRouter(
    prefix="/drivers",
    tags=["Drivers"]
)

@router.post("")
async def create_driver(
    full_name: str = Form(...),
    phone: str = Form(None),
    email: str = Form(None),
    profile_image_url: str = Form(None),
    vehicle_type: str = Form(None),
    vehicle_number: str = Form(None),
    status: str = Form("Offline"),
    file: UploadFile = File(None),
    db=Depends(get_db)
):
    image_url = profile_image_url

    if file:
        upload_result = upload_to_cloudinary(file, folder="drivers")
        image_url = upload_result["url"]

    payload = {
        "full_name": full_name,
        "phone": phone,
        "email": email,
        "profile_image_url": image_url,
        "vehicle_type": vehicle_type,
        "vehicle_number": vehicle_number,
        "status": status
    }

    create_driver_service(db, payload)

    return {
        "success": True,
        "message": "Driver created successfully"
    }


#  GET ALL
@router.get("")
def get_drivers(db=Depends(get_db)):

    drivers = get_drivers_service(db)

    return {
        "success": True,
        "count": len(drivers),
        "data": drivers
    }


#  GET BY ID
@router.get("/{driver_id}")
def get_driver_by_id(driver_id: int, db=Depends(get_db)):

    driver = get_driver_by_id_service(db, driver_id)

    return {
        "success": True,
        "data": driver
    }


#  UPDATE DRIVER 
@router.put("/{driver_id}")
async def update_driver(
    driver_id: int,
    full_name: str = Form(...),
    phone: str = Form(None),
    email: str = Form(None),
    profile_image_url: str = Form(None),
    vehicle_type: str = Form(None),
    vehicle_number: str = Form(None),
    status: str = Form("Offline"),
    file: UploadFile = File(None),
    db=Depends(get_db)
):
    image_url = profile_image_url

    if file:
        upload_result = upload_to_cloudinary(file, folder="drivers")
        image_url = upload_result["url"]

    payload = {
        "full_name": full_name,
        "phone": phone,
        "email": email,
        "profile_image_url": image_url,
        "vehicle_type": vehicle_type,
        "vehicle_number": vehicle_number,
        "status": status
    }

    update_driver_service(db, driver_id, payload)

    return {
        "success": True,
        "message": "Driver updated successfully"
    }

#  UPDATE STATUS
@router.patch("/{driver_id}/status")
def update_driver_status(
    driver_id: int,
    payload: DriverStatusUpdate,
    db=Depends(get_db)
):

    update_driver_status_service(
        db,
        driver_id,
        payload
    )

    return {
        "success": True,
        "message": "Driver status updated successfully"
    }


#  DELETE
@router.delete("/{driver_id}")
def delete_driver(driver_id: int, db=Depends(get_db)):

    delete_driver_service(db, driver_id)

    return {
        "success": True,
        "message": "Driver deleted successfully"
    }