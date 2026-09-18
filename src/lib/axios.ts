// lib/axios.ts
import config from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
});

// ============================================
// ✅ REQUEST INTERCEPTOR — Token + Session
// ============================================
axiosInstance.interceptors.request.use(
  (config) => {
    // ✅ Auth token (logged-in users)
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      // Also check redux-persist storage
      (() => {
        try {
          const persistRoot = localStorage.getItem("persist:root");
          if (!persistRoot) return null;
          const auth = JSON.parse(JSON.parse(persistRoot).auth || "{}");
          return auth?.token || null;
        } catch {
          return null;
        }
      })();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Guest session ID
    const sessionId = localStorage.getItem("guest_session_id");
    if (sessionId && config.headers) {
      config.headers["x-session-id"] = sessionId;
    }

    // ✅ Debug log (remove in production)
    console.log("🚀 Request:", {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      hasSession: !!sessionId,
    });

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// ✅ RESPONSE INTERCEPTOR
// ============================================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ 401/403 হলে log
    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      console.warn("🚫 Auth failed:", {
        url: error.config?.url,
        status: error.response.status,
        message: error.response?.data?.message,
      });
    }
    return Promise.reject(error);
  }
);