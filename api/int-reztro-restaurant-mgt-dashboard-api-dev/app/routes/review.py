from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.review_schemas import (
    ReviewCreateSchema,
    ReviewUpdateSchema
)

from app.services.review_service import (
    create_review_service,
    get_reviews_by_menu_id_service,
    get_review_by_id_service,
    update_review_service,
    delete_review_service,
    get_review_summary_service,
    get_review_statistics_service,
    get_all_reviews_service
)

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
)


#  CREATE REVIEW
@router.post("")
def create_review(
    payload: ReviewCreateSchema,
    db: Session = Depends(get_db)
):
    create_review_service(db, payload)
    return {"message": "Review added successfully"}

@router.get("")
def get_all_reviews(
    db: Session = Depends(get_db)
):
    reviews = get_all_reviews_service(db)
    return {
        "success": True,
        "count": len(reviews),
        "data": reviews
    }
#  REVIEW SUMMARY 
@router.get("/summary")
def get_review_summary(
    db: Session = Depends(get_db)
):
    return get_review_summary_service(db)


#  REVIEW STATISTICS 
@router.get("/statistics")
def get_review_statistics(
    db: Session = Depends(get_db)
):
    return get_review_statistics_service(db)


#  GET ALL REVIEWS BY MENU ID
@router.get("/menu/{menu_id}")
def get_reviews_by_menu(
    menu_id: int,
    db: Session = Depends(get_db)
):
    return get_reviews_by_menu_id_service(db, menu_id)


# GET REVIEW BY ID
@router.get("/{review_id}")
def get_review_by_id(
    review_id: int,
    db: Session = Depends(get_db)
):
    return get_review_by_id_service(db, review_id)


#  UPDATE REVIEW
@router.put("/{review_id}")
def update_review(
    review_id: int,
    payload: ReviewUpdateSchema,
    db: Session = Depends(get_db)
):
    update_review_service(db, review_id, payload)
    return {"message": "Review updated successfully"}


#  DELETE REVIEW
@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db)
):
    delete_review_service(db, review_id)
    return {"message": "Review deleted successfully"}