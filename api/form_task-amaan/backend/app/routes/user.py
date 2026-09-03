from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import UserRegistration
from app.utils.file_handler import read_user, write_user

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/")
def create_user(registration: UserRegistration):
    users = read_user()

    new_id = max([u.get("id", 0) for u in users], default=0) + 1

    user_dict = registration.model_dump()
    user_dict["id"] = new_id
    user_dict["created_at"] = "now" 

    users.append(user_dict)
    write_user(users)

    return {
        "message": "User registered successfully",
        "data": user_dict
    }


@router.get("/")
def get_users():
    users = read_user()
    return {
        "data": users,
        "total": len(users)
    }


@router.get("/{user_id}")
def get_user(user_id: int):
    users = read_user()

    for user in users:
        if user.get("id") == user_id:
            return user

    raise HTTPException(status_code=404, detail="User not found")


@router.put("/{user_id}")
def update_user(user_id: int, registration: UserRegistration):
    users = read_user()

    for index, user in enumerate(users):
        if user.get("id") == user_id:
            updated_data = registration.model_dump()
            updated_data["id"] = user_id
            if "created_at" in user:
                updated_data["created_at"] = user["created_at"]

            users[index] = updated_data
            write_user(users)

            return {"message": "User updated successfully", "data": updated_data}

    raise HTTPException(status_code=404, detail="User not found")


@router.delete("/{user_id}")
def delete_user(user_id: int):
    users = read_user()

    new_users = [u for u in users if u.get("id") != user_id]

    if len(users) == len(new_users):
        raise HTTPException(status_code=404, detail="User not found")

    write_user(new_users)

    return {"message": "User deleted successfully"}