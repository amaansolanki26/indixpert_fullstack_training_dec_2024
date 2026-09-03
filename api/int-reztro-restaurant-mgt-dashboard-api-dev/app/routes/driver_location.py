from fastapi import (
    APIRouter,
    Depends
)

from app.db.database import get_db

from app.schemas.driver_location_schemas import (
    DriverLocationCreate
)

from app.services.driver_location_service import (
    create_driver_location_service,
    get_driver_locations_service,
    get_driver_location_history_service,
    get_latest_driver_location_service,
    get_latest_driver_locations_service,
    delete_driver_location_service
)

router = APIRouter(
    prefix="/driver-locations",
    tags=["Driver Locations"]
)

# CREATE DRIVER LOCATION

@router.post("")
def create_driver_location(
    payload: DriverLocationCreate,
    db=Depends(get_db)
):

    location = create_driver_location_service(
        db,
        payload
    )

    return {
        "success": True,
        "message": "Driver location added successfully",
        "data": location
    }

# GET ALL DRIVER LOCATIONS

@router.get("")
def get_driver_locations(
    db=Depends(get_db)
):

    locations = get_driver_locations_service(db)

    return {
        "success": True,
        "count": len(locations),
        "data": locations
    }


# GET DRIVER LOCATION HISTORY

@router.get("/driver/{driver_id}/history")
def get_driver_location_history(
    driver_id: int,
    db=Depends(get_db)
):

    locations = get_driver_location_history_service(
        db,
        driver_id
    )

    return {
        "success": True,
        "count": len(locations),
        "data": locations
    }


# GET LATEST LOCATION OF A DRIVER

@router.get("/driver/{driver_id}/latest")
def get_latest_driver_location(
    driver_id: int,
    db=Depends(get_db)
):

    location = get_latest_driver_location_service(
        db,
        driver_id
    )

    return {
        "success": True,
        "data": location
    }


# GET LATEST LOCATION OF ALL DRIVERS

@router.get("/latest")
def get_latest_driver_locations(
    db=Depends(get_db)
):

    locations = get_latest_driver_locations_service(db)

    return {
        "success": True,
        "count": len(locations),
        "data": locations
    }


# DELETE DRIVER LOCATION

@router.delete("/{driver_location_id}")
def delete_driver_location(
    driver_location_id: int,
    db=Depends(get_db)
):

    delete_driver_location_service(
        db,
        driver_location_id
    )

    return {
        "success": True,
        "message": "Driver location deleted successfully"
    }