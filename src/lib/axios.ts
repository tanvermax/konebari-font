// lib/axios.ts
import config from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
});

// ============================================
// ✅ TOKEN HELPER
// ============================================
const isValidToken = (token: unknown): token is string => {
  if (!token) return false;
  if (typeof token !== "string") return false;
  if (token === "undefined" || token === "null") return false;
  if (token.length < 50) return false;

  const parts = token.split(".");
  return parts.length === 3;
};

const getAuthToken = (): string | null => {
  try {
    // 1️⃣ Direct localStorage
    let token = localStorage.getItem("token");
    if (isValidToken(token)) {
      console.log("✅ Token from localStorage");
      return token;
    }

    // 2️⃣ SessionStorage
    token = sessionStorage.getItem("token");
    if (isValidToken(token)) {
      console.log("✅ Token from sessionStorage");
      return token;
    }

    // 3️⃣ Redux Persist
    const persistRoot = localStorage.getItem("persist:root");
    if (persistRoot) {
      const parsed = JSON.parse(persistRoot);
      const auth = JSON.parse(parsed.auth || "{}");
      token = auth?.token;

      if (isValidToken(token)) {
        console.log("✅ Token from persist:root");
        return token;
      }
    }

    console.warn("⚠️ No valid token found");
    return null;
  } catch (error) {
    console.error("❌ Token extraction error:", error);
    return null;
  }
};

// ============================================
// ✅ REQUEST INTERCEPTOR
// ============================================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Guest session
    const sessionId = localStorage.getItem("guest_session_id");
    if (sessionId && config.headers) {
      config.headers["x-session-id"] = sessionId;
    }

    // ✅ Safe log — convert to string
    // const authHeader = config.headers?.Authorization;
    // const authPreview =
    //   typeof authHeader === "string"
    //     ? authHeader.substring(0, 50)
    //     : String(authHeader || "").substring(0, 50);

    // console.log("🚀 Request:", {
    //   url: config.url,
    //   method: config.method,
    //   hasToken: !!token,
    //   tokenPreview: token ? token.substring(0, 30) + "..." : null,
    //   authHeader: authPreview,
    // });

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
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("🚫 Auth failed:", {
        url: error.config?.url,
        status: error.response.status,
        message: error.response?.data?.message,
      });
    }
    return Promise.reject(error);
  }
);