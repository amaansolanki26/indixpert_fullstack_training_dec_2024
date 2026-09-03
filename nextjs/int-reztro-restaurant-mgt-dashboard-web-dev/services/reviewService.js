import api from "./api";
 
/* ==========================================================================
   HELPER UTILITIES & ID EXTRACTION
   ========================================================================== */
 
const getReviewId = (reviewId) => {
    return reviewId?.review_id || reviewId?.id || reviewId;
};
 
const getMenuId = (menuId) => {
    return menuId?.menu_id || menuId?.id || menuId;
};
 
/* ==========================================================================
   PAYLOAD BUILDERS (DATA FORMATTING FOR BACKEND)
   ========================================================================== */
 
const buildReviewPayload = (payload) => {
    return {
        customer_id: Number(payload.customer_id || 0),
        menu_id: Number(payload.menu_id || 0),
        rating: Number(payload.rating || 0),
        comment: payload.comment?.trim() || null,
 
        // Detailed criteria mappings from your SQL schema (Nullable check handles)
        food_quality: payload.food_quality !== undefined && payload.food_quality !== null
            ? Number(payload.food_quality)
            : null,
        service: payload.service !== undefined && payload.service !== null
            ? Number(payload.service)
            : null,
        ambiance: payload.ambiance !== undefined && payload.ambiance !== null
            ? Number(payload.ambiance)
            : null,
        value_for_money: payload.value_for_money !== undefined && payload.value_for_money !== null
            ? Number(payload.value_for_money)
            : null,
        cleanliness: payload.cleanliness !== undefined && payload.cleanliness !== null
            ? Number(payload.cleanliness)
            : null,
 
        review_type: payload.review_type?.trim() || 'Positive',
        is_active: payload.hasOwnProperty('is_active') ? payload.is_active : true
    };
};
 
/* ==========================================================================
   EXPORTED REVIEWS CRUD SERVICE
   ========================================================================== */
 
export const reviewService = {
    /*
    |--------------------------------------------------------------------------
    | REVIEWS BASIC CRUD & FETCH OPERATIONS
    |--------------------------------------------------------------------------
    */
 
    // 1. Get All Reviews (Swagger top root endpoint)
    getReviewsList: () => {
        return api.get("/reviews");
    },
 
    // 2. Create a new review (POST /reviews)
    createReview: (payload) => {
        const jsonPayload = buildReviewPayload(payload);
        
        return api.post("/reviews", jsonPayload);
    },
 
    // 3. Get Summary details of ratings (GET /reviews/summary)
    getReviewSummary: () => {
        return api.get("/reviews/summary");
    },
 
    // 4. Get analytical chart data / metrics (GET /reviews/statistics)
    getReviewStatistics: () => {
        return api.get("/reviews/statistics");
    },
 
    // 5. Get specific reviews assigned to a particular Menu Item (GET /reviews/menu/{menu_id})
    getReviewsByMenu: (menuId) => {
        const id = getMenuId(menuId);
        return api.get(`/reviews/menu/${id}`);
    },
 
    // 6. Fetch individual review data structure (GET /reviews/{review_id})
    getReviewById: (reviewId) => {
        const id = getReviewId(reviewId);
        return api.get(`/reviews/${id}`);
    },
 
    // 7. Update an existing review (PUT /reviews/{review_id})
    updateReview: (reviewId, payload) => {
        const id = getReviewId(reviewId);
        const jsonPayload = buildReviewPayload(payload);
        
        return api.put(`/reviews/${id}`, jsonPayload);
    },
 
    // 8. Remove or soft delete a specific review record (DELETE /reviews/{review_id})
    deleteReview: (reviewId) => {
        const id = getReviewId(reviewId);
        return api.delete(`/reviews/${id}`);
    }
};