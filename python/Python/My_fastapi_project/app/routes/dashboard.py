from fastapi import APIRouter, Depends
from app.core.security import verify_token

router = APIRouter()

@router.get("/dashboard")
def dashboard(user=Depends(verify_token)):
    return {
        "message": "User logged in"
    }

