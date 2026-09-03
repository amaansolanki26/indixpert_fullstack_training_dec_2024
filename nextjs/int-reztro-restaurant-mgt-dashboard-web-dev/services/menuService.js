import api from "./api";

const getMenuId = (menuId) => {
    return menuId?.menu_id || menuId?.id || menuId;
};

const getCategoryId = (categoryId) => {
    return categoryId?.category_id || categoryId?.id || categoryId;
};

const getTagId = (tagId) => {
    return tagId?.tag_id || tagId?.id || tagId;
};

const getMealTimeId = (mealTimeId) => {
    return mealTimeId?.meal_time_id || mealTimeId?.id || mealTimeId;
};

const getPromotionId = (promotionId) => {
    return promotionId?.promotion_id || promotionId?.id || promotionId;
};

const buildMenuFormData = (payload) => {
    const formData = new FormData();

    formData.append("category_id", Number(payload.category_id || 0));
    formData.append("name", payload.name?.trim() || "");
    formData.append("price", Number(payload.price || 0));
    formData.append("rating", Number(payload.rating || 0));
    formData.append("description", payload.description?.trim() || "");
    formData.append("values_text", payload.values_text?.trim() || "");

    if (payload.image_file) {
        formData.append("file", payload.image_file);
    } else {
        formData.append("image_url", payload.image_url || "");
    }

    formData.append("nutrition", JSON.stringify(payload.nutrition || null));
    formData.append("ingredients", JSON.stringify(payload.ingredients || []));
    formData.append("tag_ids", JSON.stringify(payload.tag_ids || []));
    formData.append("meal_time_ids", JSON.stringify(payload.meal_time_ids || []));
    // formData.append("promotion_ids", JSON.stringify(payload.promotion_ids || []));
    if (
        payload.promotion_ids !== undefined &&
        payload.promotion_ids !== null
    ) {
        formData.append(
            "promotion_ids",
            JSON.stringify(payload.promotion_ids)
        );
    }
    formData.append("category_ids", JSON.stringify(payload.category_ids || []));

    formData.append("is_featured", payload.is_featured || false);
    formData.append("is_top_rated", payload.is_top_rated || false);
    formData.append("is_recommended", payload.is_recommended || false);
    formData.append("is_new", payload.is_new || false);

    return formData;
};

const buildCategoryPayload = (payload) => {
    const data = {
        category_name: payload.category_name?.trim(),
    };

    if (payload.hasOwnProperty('is_active')) {
        data.is_active = payload.is_active;
    }

    return data;
};

const buildTagPayload = (payload) => {
    const data = {
        tag_name: payload.tag_name?.trim(),
    };

    if (payload.hasOwnProperty('is_active')) {
        data.is_active = payload.is_active;
    }

    return data;
};

const buildMealTimePayload = (payload) => {
    const data = {
        meal_time_name: payload.meal_time_name?.trim(),
    };

    if (payload.hasOwnProperty("is_active")) {
        data.is_active = payload.is_active;
    }

    return data;
};

const buildPromotionPayload = (payload) => {
    return {
        promotion_title: payload.promotion_title?.trim(),

        promotion_code: payload.promotion_code?.trim() || null,

        discount_type: payload.discount_type?.trim(),

        discount_value: Number(payload.discount_value || 0),

        start_date: payload.start_date || null,

        end_date: payload.end_date || null,

        min_order_amount:
            payload.min_order_amount === "" ||
                payload.min_order_amount === null ||
                payload.min_order_amount === undefined
                ? null
                : Number(payload.min_order_amount),

        max_discount_amount:
            payload.max_discount_amount === "" ||
                payload.max_discount_amount === null ||
                payload.max_discount_amount === undefined
                ? null
                : Number(payload.max_discount_amount),
    };
};

export const menuService = {
    /*
    |--------------------------------------------------------------------------
    | MENU ITEMS CRUD
    |--------------------------------------------------------------------------
    */

    // Get all menu items
    getMenuItems: () => api.get("/menu-items"),

    getTopRatedMenus: () => api.get("/menu-items/top-rated"),

    // Upload menu image
    uploadMenuImage: (file) => {
        const formData = new FormData();

        formData.append("file", file);

        return api.post("/menu-items/upload-image", formData);
    },

    // Get single menu item by ID
    getMenuItemById: (menuId) => {
        const id = getMenuId(menuId);
        return api.get(`/menu-items/${id}`);
    },

    // Create menu item
    createMenuItem: (payload) => {
        const formData = buildMenuFormData(payload);

        return api.post("/menu-items", formData);
    },

    // Update menu item
    updateMenuItem: (menuId, payload) => {
        const id = getMenuId(menuId);
        const formData = buildMenuFormData(payload);

        return api.put(`/menu-items/${id}`, formData);
    },

    // Delete menu item
    deleteMenuItem: (menuId) => {
        const id = getMenuId(menuId);
        return api.delete(`/menu-items/${id}`);
    },

    // Get Menu Order Overview (Swagger API ke hisaab se)
    getMenuOrderOverview: (menuId, filter) => {
        const id = getMenuId(menuId);
        // query param mein filter pass kar rahe hain (week, month, ya year)
        return api.get(`/menu-items/${id}/orders-overview?filter=${filter}`);
    },

    /*
    |--------------------------------------------------------------------------
    | MENU CATEGORIES CRUD
    |--------------------------------------------------------------------------
    */

    // Get all categories
    getMenuCategories: () => api.get("/menu-categories"),

    // Get single category
    getMenuCategoryById: (categoryId) => {
        const id = getCategoryId(categoryId);
        return api.get(`/menu-categories/${id}`);
    },

    // Create category
    createMenuCategory: (payload) => {
        const jsonPayload = buildCategoryPayload(payload);

        return api.post("/menu-categories", jsonPayload);
    },

    // Update category
    updateMenuCategory: (categoryId, payload) => {
        const id = getCategoryId(categoryId);
        const jsonPayload = buildCategoryPayload(payload);

        return api.put(`/menu-categories/${id}`, jsonPayload);
    },

    // Delete category
    deleteMenuCategory: (categoryId) => {
        const id = getCategoryId(categoryId);
        return api.delete(`/menu-categories/${id}`);
    },

    restoreMenuCategory: (id) => {
        return api.patch(`/menu-categories/${id}/restore`);
    },

    /*
    |--------------------------------------------------------------------------
    | TAGS CRUD
    |--------------------------------------------------------------------------
    */

    getTags: () => api.get("/tags"),

    getTagById: (tagId) => {
        const id = getTagId(tagId);
        return api.get(`/tags/${id}`);
    },

    createTag: (payload) => {
        const jsonPayload = buildTagPayload(payload);

        return api.post("/tags", jsonPayload);
    },

    updateTag: (tagId, payload) => {
        const id = getTagId(tagId);
        const jsonPayload = buildTagPayload(payload);

        return api.put(`/tags/${id}`, jsonPayload);
    },

    deleteTag: (tagId) => {
        const id = getTagId(tagId);
        return api.delete(`/tags/${id}`);
    },

    restoreTag: (id) => {
        return api.patch(`/tags/${id}/restore`);
    },

    /*
    |--------------------------------------------------------------------------
    | MEAL TIMES CRUD
    |--------------------------------------------------------------------------
    */

    getMealTimes: () => api.get("/meal-times"),

    getMealTimeById: (mealTimeId) => {
        const id = getMealTimeId(mealTimeId);
        return api.get(`/meal-times/${id}`);
    },

    createMealTime: (payload) => {
        const jsonPayload = buildMealTimePayload(payload);


        return api.post("/meal-times", jsonPayload);
    },

    updateMealTime: (mealTimeId, payload) => {
        const id = getMealTimeId(mealTimeId);
        const jsonPayload = buildMealTimePayload(payload);

        return api.put(`/meal-times/${id}`, jsonPayload);
    },

    deleteMealTime: (mealTimeId) => {
        const id = getMealTimeId(mealTimeId);
        return api.delete(`/meal-times/${id}`);
    },

    restoreMealTime: (id) => {
        return api.patch(`/meal-times/${id}/restore`);
    },

    /*
    |--------------------------------------------------------------------------
    | PROMOTIONS CRUD
    |--------------------------------------------------------------------------
    */

    getPromotions: () => api.get("/promotions"),

    getPromotionById: (promotionId) => {
        const id = getPromotionId(promotionId);
        return api.get(`/promotions/${id}`);
    },

    createPromotion: (payload) => {
        const jsonPayload = buildPromotionPayload(payload);

        return api.post("/promotions", jsonPayload);
    },

    updatePromotion: (promotionId, payload) => {
        const id = getPromotionId(promotionId);
        const jsonPayload = buildPromotionPayload(payload);

        return api.put(`/promotions/${id}`, jsonPayload);
    },

    deletePromotion: (promotionId) => {
        const id = getPromotionId(promotionId);
        return api.delete(`/promotions/${id}`);
    },
    
    restorePromotion: (id) => {
        return api.patch(`/promotions/restore/${id}`);
    },
};