from fastapi import (
    HTTPException,
    status
)

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def create_driver_service(
    db,
    payload
):

    try:

        db.execute(
            text("""
                EXEC Reztro.AddDriver
                    @full_name=:full_name,
                    @phone=:phone,
                    @email=:email,
                    @profile_image_url=:profile_image_url,
                    @vehicle_type=:vehicle_type,
                    @vehicle_number=:vehicle_number,
                    @status=:status
            """),
            payload
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def get_drivers_service(
    db
):

    try:

        result = db.execute(
            text("EXEC Reztro.GetDrivers")
        )

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def get_driver_by_id_service(
    db,
    driver_id
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetDriverById
                    @driver_id=:driver_id
            """),
            {
                "driver_id": driver_id
            }
        )

        driver = result.mappings().first()

        if not driver:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Driver not found"
            )

        return driver

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def update_driver_service(
    db,
    driver_id,
    payload
):

    try:

        db.execute(
            text("""
                EXEC Reztro.UpdateDriver
                    @driver_id=:driver_id,
                    @full_name=:full_name,
                    @phone=:phone,
                    @email=:email,
                    @profile_image_url=:profile_image_url,
                    @vehicle_type=:vehicle_type,
                    @vehicle_number=:vehicle_number,
                    @status=:status
            """),
            {
                "driver_id": driver_id,
                **payload
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def update_driver_status_service(
    db,
    driver_id,
    payload
):

    try:

        db.execute(
            text("""
                EXEC Reztro.UpdateDriverStatus
                    @driver_id=:driver_id,
                    @status=:status
            """),
            {
                "driver_id": driver_id,
                "status": payload.status
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def delete_driver_service(
    db,
    driver_id
):

    try:

        db.execute(
            text("""
                EXEC Reztro.DeleteDriver
                    @driver_id=:driver_id
            """),
            {
                "driver_id": driver_id
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )