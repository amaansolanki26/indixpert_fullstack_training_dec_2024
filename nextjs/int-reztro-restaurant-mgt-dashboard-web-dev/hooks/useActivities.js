import { useState, useEffect } from "react";
import { activityService } from "@/services/activityService";
 
export function useActivities(limit = 5) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const fetchActivities = async () => {
    try {
      setLoading(true);
      
      const res = await activityService.getRecentActivities(limit);
      
      const data = res?.activity_logs || res?.data || res || [];
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Hook activity fetch error:", err);
      setError(err.message || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchActivities();
  }, [limit]);
 
  return { activities, loading, error, refreshActivities: fetchActivities };
}