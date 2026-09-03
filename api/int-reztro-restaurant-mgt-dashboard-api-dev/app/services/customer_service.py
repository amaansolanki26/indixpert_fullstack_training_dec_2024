from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.schemas.customer_schemas import CustomerCreate, CustomerUpdate

def create_customer_service(db, payload: CustomerCreate):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.AddCustomer
                    @full_name = :full_name,
                    @email = :email,
                    @phone = :phone,
                    @address = :address,
                    @profile_image_url = :profile_image_url
            """),
            payload.model_dump()
        )

        customer = result.mappings().first()
        db.commit()
        return customer

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


def get_customers_service(db):
    try:
        result = db.execute(
            text("EXEC Reztro.GetCustomers")
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


def get_customer_by_id_service(db, customer_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetCustomerById
                    @customer_id = :customer_id
            """),
            {"customer_id": customer_id}
        )

        customer = result.mappings().first()

        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found"
            )

        return customer

    except HTTPException:
        raise
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


def update_customer_service(db, customer_id: int, payload: CustomerUpdate):
    try:
        data = payload.model_dump()

        # if data.get("profile_image_url") is None:
        #     data.pop("profile_image_url")

        db.execute(
            text("""
                EXEC Reztro.UpdateCustomer
                    @customer_id = :customer_id,
                    @full_name = :full_name,
                    @email = :email,
                    @phone = :phone,
                    @address = :address,
                    @profile_image_url = :profile_image_url
            """),
            {
                "customer_id": customer_id,
                **data
            }
        )

        db.commit()

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )


def delete_customer_service(db, customer_id: int):
    try:
        db.execute(
            text("""
                EXEC Reztro.DeleteCustomer
                    @customer_id = :customer_id
            """),
            {"customer_id": customer_id}
        )

        db.commit()

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig)
        )