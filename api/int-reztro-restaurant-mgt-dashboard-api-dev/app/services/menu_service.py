from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.services.menu_nutrition_service import (
    add_menu_nutrition_service,
    update_menu_nutrition_by_menu_id_service,
    delete_menu_nutrition_by_menu_id_service,
    get_menu_nutrition_by_menu_id_service   
)

from app.services.menu_ingredient_service import (
    create_menu_ingredient_service,
    delete_menu_ingredients_by_menu_id_service,
    get_menu_ingredients_by_menu_id_service  
)

from app.services.menu_item_tag_service import (
    add_menu_item_tag_service,
    remove_all_tags_from_menu_item_service,
    get_tags_by_menu_id_service            
)

from app.services.menu_item_promotion_service import (
    add_menu_item_promotion_service,
    remove_all_promotions_from_menu_item_service,
    get_promotions_by_menu_id_service       
)

from app.services.menu_item_meal_time_service import (
    add_menu_item_meal_time_service,
    remove_all_meal_times_from_menu_item_service,
    get_meal_times_by_menu_id_service       
)

def create_menu_item_service(db, payload):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.AddMenuItem
                    @category_id=:category_id,
                    @name=:name,
                    @image_url=:image_url,
                    @price=:price,
                    @description=:description,
                    @values_text=:values_text,
                    @is_featured=:is_featured,
                    @is_recommended=:is_recommended,
                    @is_new=:is_new
            """),
            payload.model_dump(exclude={
                "nutrition",
                "ingredients",
                "tag_ids",
                "meal_time_ids",
                "promotion_ids",
                "category_ids",
                "rating",           
                "is_top_rated"      
            })
        )

        menu = result.mappings().first()

        if not menu:
            raise HTTPException(
                status_code=500,
                detail="Menu item created but menu_id not returned"
            )

        menu_id = menu["menu_id"]

        category_ids = payload.category_ids or []

        if payload.category_id and payload.category_id not in category_ids:
            category_ids.append(payload.category_id)

        category_ids = list(set(category_ids)) 
        
        for category_id in category_ids:
            db.execute(
                text("""
                    EXEC Reztro.AddMenuItemCategory
                        @menu_id=:menu_id,
                        @category_id=:category_id
                """),
                {
                    "menu_id": menu_id,
                    "category_id": category_id
                }
            )

        if payload.nutrition:
            add_menu_nutrition_service(db, {
                "menu_id": menu_id,
                "calories": payload.nutrition.calories,
                "proteins": payload.nutrition.proteins,
                "fats": payload.nutrition.fats,
                "carbs": payload.nutrition.carbs
            })

        if payload.ingredients:
            for ingredient in payload.ingredients:
                create_menu_ingredient_service(db, {
                    "menu_id": menu_id,
                    "ingredient_name": ingredient
                })

        if payload.tag_ids:
            for tag_id in payload.tag_ids:
                add_menu_item_tag_service(db, {
                    "menu_id": menu_id,
                    "tag_id": tag_id
                })

        if payload.meal_time_ids:
            for meal_time_id in payload.meal_time_ids:
                add_menu_item_meal_time_service(db, {
                    "menu_id": menu_id,
                    "meal_time_id": meal_time_id
                })

        if payload.promotion_ids and len(payload.promotion_ids) > 0:
            for promotion_id in payload.promotion_ids:
                add_menu_item_promotion_service(db, {
                    "menu_id": menu_id,
                    "promotion_id": promotion_id
                })

        db.commit()

        return menu

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

def get_menu_items_service(db):
    try:
        result = db.execute(
            text(""" EXEC Reztro.GetMenuItems """)
        )

        items = result.mappings().all()

        enriched_items = []

        for item in items:
            menu_id = item["menu_id"]
            enriched_item = dict(item)

            try:
                enriched_item["nutrition"] = get_menu_nutrition_by_menu_id_service(
                    db, {"menu_id": menu_id}
                )
            except Exception:
                enriched_item["nutrition"] = None

            try:
                ing = get_menu_ingredients_by_menu_id_service(
                    db, {"menu_id": menu_id}
                )
                enriched_item["ingredients"] = [i["ingredient_name"] for i in ing]
            except Exception:
                enriched_item["ingredients"] = []

            try:
                enriched_item["tags"] = get_tags_by_menu_id_service(
                    db, {"menu_id": menu_id}
                )
            except Exception:
                enriched_item["tags"] = []

            try:
                enriched_item["meal_times"] = get_meal_times_by_menu_id_service(
                    db, {"menu_id": menu_id}
                )
            except Exception:
                enriched_item["meal_times"] = []

            try:
                enriched_item["promotions"] = get_promotions_by_menu_id_service(
                    db, menu_id
                )
            except Exception:
                enriched_item["promotions"] = []

            enriched_items.append(enriched_item)

        return enriched_items

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )
        
def get_menu_item_by_id_service(db, menu_id: int):
    try:
        result = db.execute(
            text("""
                EXEC Reztro.GetMenuItemById
                    @menu_id=:menu_id
            """),
            {"menu_id": menu_id}
        )

        item = result.mappings().first()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Menu item not found"
            )

        enriched_item = dict(item)

        try:
            enriched_item["nutrition"] = get_menu_nutrition_by_menu_id_service(
                db, {"menu_id": menu_id}
            )
        except Exception:
            enriched_item["nutrition"] = None

        try:
            ing = get_menu_ingredients_by_menu_id_service(
                db, {"menu_id": menu_id}
            )
            enriched_item["ingredients"] = [i["ingredient_name"] for i in ing]
        except Exception:
            enriched_item["ingredients"] = []

        try:
            enriched_item["tags"] = get_tags_by_menu_id_service(
                db, {"menu_id": menu_id}
            )
        except Exception:
            enriched_item["tags"] = []

        try:
            enriched_item["meal_times"] = get_meal_times_by_menu_id_service(
                db, {"menu_id": menu_id}
            )
        except Exception:
            enriched_item["meal_times"] = []

        try:
            enriched_item["promotions"] = get_promotions_by_menu_id_service(
                db, menu_id
            )
        except Exception:
            enriched_item["promotions"] = []

        return enriched_item

    except HTTPException:
        raise

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )
        
def update_menu_item_service(db, menu_id: int, payload):
    try:
        existing = db.execute(
            text("""
                EXEC Reztro.GetMenuItemById
                    @menu_id=:menu_id
            """),
            {"menu_id": menu_id}
        ).mappings().first()

        if not existing:
            raise HTTPException(status_code=404, detail="Menu item not found")

        params = {
            "menu_id": menu_id,
            "category_id": payload.category_id if payload.category_id is not None else existing["category_id"],
            "name": payload.name if payload.name is not None else existing["name"],
            "image_url": payload.image_url if payload.image_url not in [None, ""] else existing["image_url"],
            "price": payload.price if payload.price is not None else existing["price"],
            "description": payload.description if payload.description is not None else existing["description"],
            "values_text": payload.values_text if payload.values_text is not None else existing["values_text"],
            "is_featured": payload.is_featured if payload.is_featured is not None else existing["is_featured"],
            "is_recommended": payload.is_recommended if payload.is_recommended is not None else existing["is_recommended"],
            "is_new": payload.is_new if payload.is_new is not None else existing["is_new"],
        }

        db.execute(
            text("""
                EXEC Reztro.UpdateMenuItem
                    @menu_id=:menu_id,
                    @category_id=:category_id,
                    @name=:name,
                    @image_url=:image_url,
                    @price=:price,
                    @description=:description,
                    @values_text=:values_text,
                    @is_featured=:is_featured,
                    @is_recommended=:is_recommended,
                    @is_new=:is_new
            """),
            params
        )

        if payload.category_ids is not None:
            category_ids = payload.category_ids or []

            if params["category_id"] not in category_ids:
                category_ids.append(params["category_id"])

            category_ids = list(set(category_ids))

            db.execute(
                text("""
                    EXEC Reztro.DeleteMenuItemCategories
                        @menu_id=:menu_id
                """),
                {"menu_id": menu_id}
            )

            for category_id in category_ids:
                db.execute(
                    text("""
                        EXEC Reztro.AddMenuItemCategory
                            @menu_id=:menu_id,
                            @category_id=:category_id
                    """),
                    {"menu_id": menu_id, "category_id": category_id}
                )

        if payload.nutrition is not None:
            nutrition_data = (
                payload.nutrition
                if isinstance(payload.nutrition, dict)
                else payload.nutrition.model_dump(exclude_unset=True)
            )

            try:
                existing = None

                try:
                    existing = get_menu_nutrition_by_menu_id_service(
                        db, {"menu_id": menu_id}
                    )
                except HTTPException as e:
                    if e.status_code != 404:
                        raise  

                if existing:
                    update_menu_nutrition_by_menu_id_service(
                        db, menu_id, nutrition_data
                    )
                else:
                    add_menu_nutrition_service(db, {
                        **nutrition_data,
                        "menu_id": menu_id
                    })

            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Nutrition update failed: {str(e)}"
                )

        if payload.ingredients is not None:
            delete_menu_ingredients_by_menu_id_service(db, {"menu_id": menu_id})

            for ing in payload.ingredients:
                if ing:
                    create_menu_ingredient_service(db, {
                        "menu_id": menu_id,
                        "ingredient_name": ing
                    })

        if payload.tag_ids is not None:
            remove_all_tags_from_menu_item_service(db, {"menu_id": menu_id})

            for tag_id in payload.tag_ids:
                add_menu_item_tag_service(db, {
                    "menu_id": menu_id,
                    "tag_id": tag_id
                })

        if payload.meal_time_ids is not None:
            remove_all_meal_times_from_menu_item_service(db, {"menu_id": menu_id})

            for meal_id in payload.meal_time_ids:
                add_menu_item_meal_time_service(db, {
                    "menu_id": menu_id,
                    "meal_time_id": meal_id
                })

        if payload.promotion_ids is not None:
            remove_all_promotions_from_menu_item_service(db, {"menu_id": menu_id})

            if payload.promotion_ids:  # Only add if there are promotions
                for promo_id in payload.promotion_ids:
                    add_menu_item_promotion_service(db, {
                        "menu_id": menu_id,
                        "promotion_id": promo_id
                    })

        db.commit()

        return {"message": "Updated successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
def delete_menu_item_service(db, menu_id: int):
    try:

        delete_menu_ingredients_by_menu_id_service(
            db,
            {"menu_id": menu_id}
        )

        delete_menu_nutrition_by_menu_id_service(
            db,
            {"menu_id": menu_id}
        )

        remove_all_tags_from_menu_item_service(
            db,
            {"menu_id": menu_id}
        )

        remove_all_promotions_from_menu_item_service(
            db,
            menu_id
        )

        remove_all_meal_times_from_menu_item_service(
            db,
            {"menu_id": menu_id}
        )

        db.execute(
            text("""
                EXEC Reztro.DeleteMenuItem
                    @menu_id=:menu_id
            """),
            {"menu_id": menu_id}
        )

        db.commit()

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

def update_menu_availability_service(
    db,
    menu_id: int,
    payload
):

    try:

        db.execute(
            text("""
                EXEC Reztro.UpdateMenuAvailability
                    @menu_id=:menu_id,
                    @is_available=:is_available
            """),
            {
                "menu_id": menu_id,
                "is_available": payload.is_available
            }
        )

        db.commit()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def update_menu_stats_service(
    db,
    menu_id: int,
    payload
):

    try:

        params = payload.model_dump()

        params["menu_id"] = menu_id

        db.execute(
            text("""
                EXEC Reztro.UpdateMenuStats
                    @menu_id=:menu_id,
                    @rating=:rating,
                    @total_reviews=:total_reviews,
                    @total_orders=:total_orders,
                    @favorites_count=:favorites_count
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


def get_featured_menu_items_service(
    db
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetFeaturedMenuItems
            """)
        )

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )


def get_top_rated_menu_items_service(
    db
):

    try:

        result = db.execute(
            text("""
                EXEC Reztro.GetTopRatedMenuItems
            """)
        )

        return result.mappings().all()

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.orig)
        )

def get_menu_order_overview_service(db, menu_id: int, filter_type: str):
    result = db.execute(
        text("""
            EXEC Reztro.GetMenuOrderOverview
                @menu_id=:menu_id,
                @filter_type=:filter_type
        """),
        {
            "menu_id": menu_id,
            "filter_type": filter_type
        }
    )

    return [dict(row._mapping) for row in result]