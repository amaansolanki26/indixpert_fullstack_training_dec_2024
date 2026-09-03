import api from "@/services/api";

export const logger = {
  error: async (eventName, error, extra = {}) => {
    const logPayload = {
      level: "ERROR",
      event: eventName,
      message: error?.message || "Unknown error",
      status: error?.response?.status || null,
      apiResponse: error?.response?.data || null,
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      extra,
      createdAt: new Date().toISOString(),
    };

    // console.error("APP_ERROR:", logPayload);

    // try {
    //   await api.post("/client-logs", logPayload);
    // } catch (logError) {
    //   console.error("CLIENT_LOG_SEND_FAILED:", logError);
    // }
  },

  info: (eventName, data = {}) => {
    console.info("APP_INFO:", {
      event: eventName,
      data,
      createdAt: new Date().toISOString(),
    });
  },
};