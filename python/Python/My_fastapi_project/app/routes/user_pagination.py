from sqlalchemy import text
from fastapi import APIRouter, Depends, HTTPException
from app.core.database import get_db
import traceback

from app.schemas.user import UserUpdate

router = APIRouter()


@router.get("/pagination")
def get_users_paginated(
    offset: int = 0,
    limit: int = 10,
    search: str = "",
    db=Depends(get_db)
):
    try:

        result = db.execute(
            text("""
                EXEC TRAINING_TEAM3.GET_USERS_PAGINATION
                    @Offset=:offset,
                    @Limit=:limit,
                    @Search=:search
            """),
            {
                "offset": offset,
                "limit": limit,
                "search": search
            }
        )

        rows = result.fetchall()

        users = []

        for row in rows:
            r = row._mapping

            users.append({
                "id": r["id"],
                "name": r["name"],
                "email": r["email"],
                "contact": r["contact"],
                "state": r["state"],
                "city": r["city"]
            })

        total = rows[0]._mapping["total_count"] if rows else 0

        return {
            "data": users,
            "total": total,
            "offset": offset,
            "limit": limit,
            "search": search
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )   



@router.put("/users/{user_id}")
def update_user(
    user_id: str,
    user: UserUpdate,
    db=Depends(get_db)
):
    try:
        db.execute(
            text("""
                EXEC TRAINING_TEAM3.update_user
                    @user_id=:user_id,
                    @name=:name,
                    @email=:email,
                    @contact=:contact,
                    @state=:state,
                    @city=:city
            """),
            {
                "user_id": user_id,
                "name": user.name,
                "email": user.email,
                "contact": user.contact,
                "state": user.state,
                "city": user.city
            }
        )

        db.commit()

        return {
            "message": "User updated successfully"
        }

    except Exception as e:
        db.rollback()
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@router.delete("/users/{user_id}")
def delete_user(
    user_id:int,
    db=Depends(get_db)
):
    try:

        db.execute(
            text("""
                EXEC TRAINING_TEAM3.DeleteUser
                    @ID=:user_id
            """),
            {
                "user_id": user_id
            }
        )

        db.commit()

        return {
            "message":"User deleted successfully"
        }

    except Exception as e:
        db.rollback()

        print("DELETE ERROR:", str(e))
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )  