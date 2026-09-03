import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      let idToken = localStorage.getItem("idToken");

      if (!accessToken || !idToken) {
        const session = await fetchAuthSession();

        accessToken = session.tokens?.accessToken?.toString();
        idToken = session.tokens?.idToken?.toString();
      }

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      if (idToken) {
        config.headers["x-id-token"] = idToken;
      }
    } catch (err) {
      console.log("Token Error:", err);
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;

    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    if (
      status === 401 ||
      message.toLowerCase().includes("token expired") ||
      message.toLowerCase().includes("not authenticated")
    ) {
      // Remove tokens
      localStorage.clear();
      sessionStorage.clear();

      // Remove login cookie
      document.cookie =
        "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Redirect to login
      window.location.href = "/signin";

      return Promise.reject(new Error("Session expired"));
    }

    return Promise.reject(new Error(message));
  }
);

export default api;