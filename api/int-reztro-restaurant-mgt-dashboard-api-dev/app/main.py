from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import (
    customer,
    orders,
    menu,
    menu_category,
    dinein_order,
    takeaway_order,
    online_order,
    payment,
    order_tracking,
    driver_location,
    driver,
    promotion,
    menu_item_promotion,
    menu_item_tag,
    tags,
    menu_item_meal_time,
    meal_time,
    menu_ingredient,
    menu_nutrition,
    review,
    activity_log,
    purchase_order,
    inventory_item,
    inventory_category,
    inventory_stock_history,
    calendar_schedule,
    calendar_schedule_member,
    message,
    message_conversation,
    admins
)
from app.utils import cloudinary as cloudinary_router  
from app.websocket.chat_socket import router as websocket_router



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(websocket_router)
app.include_router(customer.router)
app.include_router(orders.router)
app.include_router(menu.router)
app.include_router(menu_category.router)
app.include_router(dinein_order.router)
app.include_router(takeaway_order.router)
app.include_router(online_order.router)
app.include_router(payment.router)
app.include_router(driver.router)
app.include_router(driver_location.router)
app.include_router(order_tracking.router)
app.include_router(promotion.router)
app.include_router(menu_item_promotion.router)
app.include_router(menu_item_tag.router)
app.include_router(tags.router)
app.include_router(meal_time.router)
app.include_router(menu_item_meal_time.router)
app.include_router(menu_ingredient.router)
app.include_router(menu_nutrition.router)
app.include_router(review.router)
app.include_router(activity_log.router)
app.include_router(purchase_order.router)
app.include_router(inventory_item.router)
app.include_router(inventory_category.router)
app.include_router(inventory_stock_history.router)
app.include_router(calendar_schedule.router)
app.include_router(calendar_schedule_member.router)
app.include_router(message.router)
app.include_router(message_conversation.router)
app.include_router(admins.router)
app.include_router(cloudinary_router.router)  