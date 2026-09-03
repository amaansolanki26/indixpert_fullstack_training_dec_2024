from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


# CREATE REVIEW
def create_review_service(db, payload):
    try:
        db.execute(
            text("""
                EXEC Reztro.AddReview
                    @customer_id=:customer_id,
                    @menu_id=:menu_id,
                    @rating=:rating,
                    @comment=:comment,
                    @food_quality=:food_quality,
                    @service=:service,
                    @ambiance=:ambiance,
                    @value_for_money=:value_for_money,
                    @cleanliness=:cleanliness
            """),
            payload.model_dump()
        )

        db.commit()

    except SQLAlchemyError as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def get_all_reviews_service(db):
    try:
        result = db.execute(text("EXEC Reztro.GetReviews"))
        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )
        

#  GET REVIEWS BY MENU
def get_reviews_by_menu_id_service(db, menu_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetReviewsByMenuId
                    @menu_id=:menu_id
            """),
            {"menu_id": menu_id}
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


#  GET REVIEW BY ID
def get_review_by_id_service(db, review_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetReviewById
                    @review_id=:review_id
            """),
            {"review_id": review_id}
        )

        review = result.mappings().first()

        if not review:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Review not found"
            )

        return review

    except HTTPException:
        raise

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


#  UPDATE REVIEW
def update_review_service(db, review_id: int, payload):
    try:
        params = payload.model_dump()
        params["review_id"] = review_id

        db.execute(
            text("""
                EXEC Reztro.UpdateReview
                    @review_id=:review_id,
                    @rating=:rating,
                    @comment=:comment,
                    @food_quality=:food_quality,
                    @service=:service,
                    @ambiance=:ambiance,
                    @value_for_money=:value_for_money,
                    @cleanliness=:cleanliness
            """),
            params
        )

        db.commit()

    except SQLAlchemyError as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


#  DELETE REVIEW (SOFT DELETE)
def delete_review_service(db, review_id: int):
    try:
        db.execute(
            text("""
                EXEC Reztro.DeleteReview
                    @review_id=:review_id
            """),
            {"review_id": review_id}
        )

        db.commit()

    except SQLAlchemyError as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


#  REVIEW SUMMARY
def get_review_summary_service(db):
    try:
        result = db.execute(
            text("EXEC Reztro.GetReviewSummary")
        )

        return result.mappings().first()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


#  REVIEW STATISTICS (rating wise count)
def get_review_statistics_service(db):
    try:
        result = db.execute(
            text("EXEC Reztro.GetReviewStatistics")
        )

        return result.mappings().all()

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )