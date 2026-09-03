from fastapi import (
    HTTPException,
    status
)

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def create_driver_location_service(
    db,
    payload
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.AddDriverLocation
                    @driver_id=:driver_id,
                    @current_latitude=:current_latitude,
                    @current_longitude=:current_longitude
            """),
            payload.model_dump()
        )

        location = result.mappings().first()

        db.commit()

        return location

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def get_driver_locations_service(
    db
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetDriverLocations
            """)
        )

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def get_driver_location_history_service(
    db,
    driver_id
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetDriverLocationHistory
                    @driver_id=:driver_id
            """),
            {
                "driver_id": driver_id
            }
        )

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def get_latest_driver_location_service(
    db,
    driver_id
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetLatestDriverLocation
                    @driver_id=:driver_id
            """),
            {
                "driver_id": driver_id
            }
        )

        return result.mappings().first()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def get_latest_driver_locations_service(
    db
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetLatestDriverLocations
            """)
        )

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def delete_driver_location_service(
    db,
    driver_location_id
):

    try:

        db.execute(
            text("""
                EXEC Reztro.DeleteDriverLocation
                    @driver_location_id=:driver_location_id
            """),
            {
                "driver_location_id": driver_location_id
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )