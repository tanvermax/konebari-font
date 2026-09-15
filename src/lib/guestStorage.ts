// lib/guestStorage.ts
const SESSION_KEY = "guest_session_id";
const CART_KEY = "guest_cart_items";
const FAVORITE_KEY = "guest_favorite_items";

/** ✅ Generate UUID v4 */
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/** 🔑 Get or create session ID */
export const getSessionId = (): string => {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `guest_${generateUUID()}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

/** 🛒 Guest cart localStorage */
export const saveGuestCart = (items: any[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const getGuestCart = (): any[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
};

export const clearGuestCart = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
};

/** ❤️ Guest favorites localStorage */
export const saveGuestFavorites = (items: any[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(items));
};

export const getGuestFavorites = (): any[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const clearGuestFavorites = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(FAVORITE_KEY);
};