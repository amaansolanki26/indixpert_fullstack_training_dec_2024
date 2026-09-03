from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException

from app.db.database import get_db
from app.utils.cloudinary import upload_to_cloudinary

from app.schemas.menu_schemas import (
    MenuItemCreate,
    MenuItemUpdate,
    MenuAvailabilityUpdate,
    MenuStatsUpdate,
)
import json
from decimal import Decimal

from app.services.menu_service import (
    create_menu_item_service,
    get_menu_items_service,
    get_menu_item_by_id_service,
    update_menu_item_service,
    delete_menu_item_service,
    update_menu_availability_service,
    update_menu_stats_service,
    get_featured_menu_items_service,
    get_top_rated_menu_items_service,
    get_menu_order_overview_service
)

router = APIRouter(prefix="/menu-items", tags=["Menu Items"])


def safe_json_load(value, default):
    try:
        return json.loads(value) if value else default
    except:
        return default


@router.post("/upload-image")
async def upload_menu_image(file: UploadFile = File(...)):
    result = upload_to_cloudinary(file)

    return {"success": True, "data": result}


@router.post("")
async def create_menu_item(
    category_id: int = Form(...),
    name: str = Form(...),
    price: Decimal = Form(...),
    description: str | None = Form(None),
    values_text: str | None = Form(None),
    image_url: str | None = Form(None),
    nutrition: str | None = Form(None),
    ingredients: str | None = Form(None),
    tag_ids: str | None = Form(None),
    meal_time_ids: str | None = Form(None),
    promotion_ids: str | None = Form(None),
    category_ids: str | None = Form(None),
    is_featured: bool = Form(False),
    is_recommended: bool = Form(False),
    is_new: bool = Form(False),
    file: UploadFile | None = File(None),
    db=Depends(get_db),
):
    final_image_url = image_url

    if file:
        upload_result = upload_to_cloudinary(file)
        final_image_url = upload_result["url"]

    elif image_url:
        upload_result = upload_to_cloudinary(image_url)  
        final_image_url = upload_result["url"]

    payload = MenuItemCreate(
        category_id=category_id,
        category_ids=safe_json_load(category_ids, []),
        name=name,
        image_url=final_image_url,
        price=price,
        description=description,
        values_text=values_text,
        nutrition=safe_json_load(nutrition, None),
        ingredients=safe_json_load(ingredients, []),
        tag_ids=safe_json_load(tag_ids, []),
        meal_time_ids=safe_json_load(meal_time_ids, []),
        promotion_ids=safe_json_load(promotion_ids, []),
        is_featured=is_featured,
        is_recommended=is_recommended,
        is_new=is_new,
    )

    data = create_menu_item_service(db, payload)

    return {"success": True, "message": "Menu item created successfully", "data": data}


@router.get("")
def get_menu_items(db=Depends(get_db)):

    items = get_menu_items_service(db)

    return {"success": True, "count": len(items), "data": items}


@router.get("/{menu_id}")
def get_menu_item_by_id(menu_id: int, db=Depends(get_db)):
    item = get_menu_item_by_id_service(db, menu_id)

    return {"success": True, "data": item}


@router.put("/{menu_id}")
async def update_menu_item(
    menu_id: int,
    category_id: int | None = Form(None),
    name: str | None = Form(None),
    price: Decimal | None = Form(None),
    description: str | None = Form(None),
    values_text: str | None = Form(None),
    image_url: str | None = Form(None),

    nutrition: str | None = Form(None),
    ingredients: str | None = Form(None),
    tag_ids: str | None = Form(None),
    meal_time_ids: str | None = Form(None),
    promotion_ids: str | None = Form(None),
    category_ids: str | None = Form(None),

    is_featured: bool | None = Form(None),
    is_recommended: bool | None = Form(None),
    is_new: bool | None = Form(None),

    file: UploadFile | None = File(None),
    db=Depends(get_db),
):
    final_image_url = image_url

    if file:
        upload_result = upload_to_cloudinary(file)
        final_image_url = upload_result["url"]

    elif image_url:
        upload_result = upload_to_cloudinary(image_url)
        final_image_url = upload_result["url"]

    def parse_json(field_name, value):
        if value is None:
            return None
        try:
            return json.loads(value)
        except Exception:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid JSON format for {field_name}"
            )

    nutrition_data = parse_json("nutrition", nutrition)
    ingredients_data = parse_json("ingredients", ingredients)
    tag_ids_data = parse_json("tag_ids", tag_ids)
    meal_time_ids_data = parse_json("meal_time_ids", meal_time_ids)
    promotion_ids_data = parse_json("promotion_ids", promotion_ids)
    category_ids_data = parse_json("category_ids", category_ids)

    payload = MenuItemUpdate(
        category_id=category_id,
        category_ids=category_ids_data,
        name=name,
        image_url=final_image_url,
        price=price,
        description=description,
        values_text=values_text,
        nutrition=nutrition_data,
        ingredients=ingredients_data,
        tag_ids=tag_ids_data,
        meal_time_ids=meal_time_ids_data,
        promotion_ids=promotion_ids_data,
        is_featured=is_featured,
        is_recommended=is_recommended,
        is_new=is_new,
    )

    update_menu_item_service(db, menu_id, payload)

    return {"success": True, "message": "Menu item updated successfully"}


@router.delete("/{menu_id}")
def delete_menu_item(menu_id: int, db=Depends(get_db)):
    delete_menu_item_service(db, menu_id)

    return {"success": True, "message": "Menu item deleted successfully"}


@router.patch("/{menu_id}/availability")
def update_menu_availability(
    menu_id: int, payload: MenuAvailabilityUpdate, db=Depends(get_db)
):
    update_menu_availability_service(db, menu_id, payload)

    return {"success": True, "message": "Availability updated successfully"}


@router.patch("/{menu_id}/stats")
def update_menu_stats(menu_id: int, payload: MenuStatsUpdate, db=Depends(get_db)):
    update_menu_stats_service(db, menu_id, payload)

    return {"success": True, "message": "Stats updated successfully"}


@router.get("/featured")
def get_featured_menu_items(db=Depends(get_db)):

    items = get_featured_menu_items_service(db)

    return {"success": True, "count": len(items), "data": items}


@router.get("/top-rated")
def get_top_rated_menu_items(db=Depends(get_db)):

    items = get_top_rated_menu_items_service(db)

    return {"success": True, "count": len(items), "data": items}


@router.get("/{menu_id}/orders-overview")
def get_menu_order_overview(
    menu_id: int,
    filter: str = "week",
    db=Depends(get_db)
):
    data = get_menu_order_overview_service(db, menu_id, filter)

    return {
        "success": True,
        "data": data
    }