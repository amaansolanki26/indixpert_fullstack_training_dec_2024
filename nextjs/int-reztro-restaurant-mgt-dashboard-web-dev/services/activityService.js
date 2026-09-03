import api from "./api";

// Helpers to extract ID safely if passed as an object or number
const getActivityId = (activityId) => {
  return activityId?.activity_id || activityId?.id || activityId;
};

const getAdminId = (adminId) => {
  return adminId?.admin_id || adminId?.id || adminId;
};

// Payload builder for POST requests to match backend structure
const buildActivityPayload = (payload) => {
  return {
    admin_id: Number(payload.admin_id || 1),
    actor_name: payload.actor_name?.trim() || "string",
    actor_role: payload.actor_role?.trim() || "string",
    activity_type: payload.activity_type?.trim() || "string",
    activity_title: payload.activity_title?.trim() || "string",
    activity_description: payload.activity_description?.trim() || "string",
  };
};

export const activityService = {
  /*
  |--------------------------------------------------------------------------
  | ACTIVITY LOGS CRUD
  |--------------------------------------------------------------------------
  */

  // 1. Get all activities
  getActivities: () => api.get("/activity-logs"),

  // 2. Create activity (POST)
  createActivity: (payload) => {
    const jsonPayload = buildActivityPayload(payload);
    
    return api.post("/activity-logs", jsonPayload);
  },

  // 3. Get activity summary
  getActivitySummary: () => api.get("/activity-logs/summary"),

  // 4. Get recent activities with limit (e.g., limit = 5)
  getRecentActivities: (limit = 5) => api.get(`/activity-logs/recent/${limit}`),

  // 5. Get activities by type (e.g., 'inventory', 'order', 'reservation')
  getActivitiesByType: (type) => api.get(`/activity-logs/type/${type}`),

  // 6. Get activities by admin ID
  getActivitiesByAdmin: (adminId) => {
    const id = getAdminId(adminId);
    return api.get(`/activity-logs/admin/${id}`);
  },

  // 7. Get activities by specific date (format: YYYY-MM-DD)
  getActivitiesByDate: (date) => api.get(`/activity-logs/date/${date}`),

  // 8. Get single activity by ID
  getActivityById: (activityId) => {
    const id = getActivityId(activityId);
    return api.get(`/activity-logs/${id}`);
  },

  // 9. Update activity (PUT)
  updateActivity: (activityId, payload) => {
    const id = getActivityId(activityId);
    const jsonPayload = buildActivityPayload(payload);
    return api.put(`/activity-logs/${id}`, jsonPayload);
  },

  // 10. Delete activity
  deleteActivity: (activityId) => {
    const id = getActivityId(activityId);
    return api.delete(`/activity-logs/${id}`);
  },
};