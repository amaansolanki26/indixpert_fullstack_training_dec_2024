from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def safe_fetch_one(result):
    try:
        return result.mappings().first()
    except Exception:
        return None


def register_admin_service(db, token: dict):
    try:
        # Extract data from Cognito token
        auth_payload = token.get("auth", {})
        user_payload = token.get("user", {})

        cognito_sub = auth_payload.get("sub")
        email = user_payload.get("email") or auth_payload.get("username")
        full_name = user_payload.get("name") or "Admin User"

        if not cognito_sub or not email:
            raise HTTPException(
                status_code=400,
                detail="Invalid token: missing sub or email"
            )

        existing = db.execute(
            text("SELECT admin_id FROM Reztro.Admins WHERE cognito_sub = :sub"),
            {"sub": cognito_sub}
        ).fetchone()

        if existing:
            return {
                "success": True,
                "message": "Admin already exists",
                "admin_id": existing[0]
            }

        result = db.execute(
            text("""
                EXEC Reztro.RegisterAdmin
                    @full_name=:full_name,
                    @email=:email,
                    @password_hash=:password_hash,
                    @cognito_sub=:cognito_sub,
                    @role='Admin'
            """),
            {
                "full_name": full_name,
                "email": email,
                "password_hash": "COGNITO_MANAGED",
                "cognito_sub": cognito_sub
            }
        )

        response = safe_fetch_one(result)
        db.commit()

        if response:
            return {
                "success": True,
                "message": "Admin registered successfully",
                "admin_id": response["admin_id"],
                "data": response
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to register admin")

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


def get_all_admins_service(db):
    try:
        result = db.execute(text("EXEC Reztro.GetAllAdmins"))
        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=str(getattr(e, "orig", e))
        )


def get_admin_by_id_service(db, admin_id: int):
    try:
        result = db.execute(
            text("EXEC Reztro.GetAdminById @admin_id=:admin_id"),
            {"admin_id": admin_id}
        )

        data = safe_fetch_one(result)

        if not data:
            raise HTTPException(status_code=404, detail="Admin not found")

        return data

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


def get_admin_by_email_service(db, email: str):
    try:
        result = db.execute(
            text("EXEC Reztro.GetAdminByEmail @email=:email"),
            {"email": email}
        )

        data = safe_fetch_one(result)

        if not data:
            raise HTTPException(status_code=404, detail="Admin not found")

        return data

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )


def update_admin_service(db, admin_id: int, payload):
    try:
        params = payload.model_dump(exclude_unset=True)
        params["admin_id"] = admin_id

        result = db.execute(
            text("""
                EXEC Reztro.UpdateAdmin
                    @admin_id=:admin_id,
                    @full_name=:full_name,
                    @email=:email,
                    @role=:role,
                    @is_active=:is_active
            """),
            params
        )

        response = safe_fetch_one(result)
        db.commit()

        if not response:
            raise HTTPException(status_code=404, detail="Admin not found")

        return response

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(getattr(e, "orig", e))
        )