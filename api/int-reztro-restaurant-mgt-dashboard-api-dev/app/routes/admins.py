from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.admin_schemas import AdminUpdate, AdminResponse
from app.services.admin_service import (
    register_admin_service,
    get_all_admins_service,
    get_admin_by_id_service,
    get_admin_by_email_service,
    update_admin_service
)
from app.security.jwt import verify_token


router = APIRouter(
    prefix="/admins",
    tags=["Admins"]
)


@router.post("")
def register_admin(
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)   
):
    """Register admin using data from Cognito token"""
    admin = register_admin_service(db, token)

    return {
        "success": True,
        "message": "Admin registered successfully",
        "admin_id": admin.get("admin_id"),
        "data": admin
    }


@router.get("")
def get_all_admins(
    db: Session = Depends(get_db),
    _token: dict = Depends(verify_token)
):
    admins = get_all_admins_service(db)

    return {
        "success": True,
        "count": len(admins),
        "data": admins
    }


@router.get("/{admin_id}")
def get_admin_by_id(
    admin_id: int,
    db: Session = Depends(get_db),
    _token: dict = Depends(verify_token)
):
    admin = get_admin_by_id_service(db, admin_id)

    return {
        "success": True,
        "data": admin
    }


@router.get("/email/{email}")
def get_admin_by_email(
    email: str,
    db: Session = Depends(get_db),
    _token: dict = Depends(verify_token)
):
    admin = get_admin_by_email_service(db, email)

    return {
        "success": True,
        "data": admin
    }


@router.put("/{admin_id}")
def update_admin(
    admin_id: int,
    payload: AdminUpdate,
    db: Session = Depends(get_db),
    _token: dict = Depends(verify_token)
):
    updated_admin = update_admin_service(db, admin_id, payload)

    return {
        "success": True,
        "message": "Admin updated successfully",
        "data": updated_admin
    }