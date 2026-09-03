from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.core.security import verify_token

router = APIRouter()


@router.post("/users")
def create_user(data = Depends(verify_token), db: Session = Depends(get_db)):
    try:
        sub = data["auth"].get("sub")

        email = data["user"].get("email") or data["auth"].get("username")
        name = data["user"].get("name", "")
        picture = data["user"].get("picture", "")

        if not sub or not email:
            raise HTTPException(
                status_code=400,
                detail="Invalid token: missing sub or email"
            )

        existing = db.execute(
            text("""
                SELECT id 
                FROM TRAINING_TEAM3.users 
                WHERE sub = :sub
            """),
            {"sub": sub}
        ).fetchone()

        if existing:
            return {
                "message": "User already exists",
                "sub": sub
            }

        db.execute(
            text("""
                EXEC TRAINING_TEAM3.sp_create_user
                    @name = :name,
                    @email = :email,
                    @picture = :picture,
                    @sub = :sub
            """),
            {
                "name": name,
                "email": email,
                "picture": picture,
                "sub": sub
            }
        )

        db.commit()

        return {
            "message": "User created successfully",
            "sub": sub
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

@router.get("/users/me")
def get_current_user(
    data = Depends(verify_token),
    db: Session = Depends(get_db)
):
    try:
        sub = data["auth"].get("sub")

        if not sub:
            raise HTTPException(status_code=401, detail="Invalid token")

        result = db.execute(
            text("""
                SELECT id, name, email, picture, sub, is_verified, created_at
                FROM TRAINING_TEAM3.users
                WHERE sub = :sub
            """),
            {"sub": sub}
        ).fetchone()

        if not result:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "id": result.id,
            "name": result.name,
            "email": result.email,
            "picture": result.picture,
            "sub": result.sub,
            "is_verified": bool(result.is_verified),
            "created_at": str(result.created_at)
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )