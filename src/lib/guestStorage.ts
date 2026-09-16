// lib/guestStorage.ts

const SESSION_KEY = "guest_session_id";
const CART_KEY = "guest_cart_v2";
const FAVORITE_KEY = "guest_favorites_v2";

const generateUUID = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export const getSessionId = (): string => {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `guest_${generateUUID()}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

// ============================================
// 🛒 CART
// ============================================

/** ✅ Same fields as DB */
export interface IGuestCartItem {
  productId: string;
  variantId: string | null;
  quantity: number;
  addedAt: string;

  // Product snapshot — same fields as DB
  title: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category?: string;
  brand?: string;
  images: string[];
  isActive?: boolean;
  nameBn?: string;
  variants?: any[];
}

export const saveGuestCart = (items: IGuestCartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cartUpdated"));
};

export const getGuestCart = (): IGuestCartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const addGuestCartItem = (item: Omit<IGuestCartItem, "addedAt">) => {
  const items = getGuestCart();
  const idx = items.findIndex(
    (i) =>
      i.productId === item.productId &&
      (i.variantId || null) === (item.variantId || null)
  );

  if (idx > -1) {
    items[idx].quantity += item.quantity;
    items[idx].title = item.title;
    items[idx].price = item.price;
    items[idx].discountPrice = item.discountPrice;
    items[idx].stock = item.stock;
    items[idx].images = item.images;
    items[idx].isActive = item.isActive;
    items[idx].slug = item.slug;
  } else {
    items.push({ ...item, addedAt: new Date().toISOString() });
  }
  saveGuestCart(items);
  return items;
};

export const updateGuestCartQuantity = (
  productId: string,
  variantId: string | null,
  quantity: number
) => {
  let items = getGuestCart();
  const idx = items.findIndex(
    (i) =>
      i.productId === productId &&
      (i.variantId || null) === (variantId || null)
  );
  if (idx > -1) {
    if (quantity <= 0) items.splice(idx, 1);
    else items[idx].quantity = quantity;
    saveGuestCart(items);
  }
  return items;
};

export const removeGuestCartItem = (
  productId: string,
  variantId: string | null
) => {
  const items = getGuestCart().filter(
    (i) =>
      !(
        i.productId === productId &&
        (i.variantId || null) === (variantId || null)
      )
  );
  saveGuestCart(items);
  return items;
};

export const clearGuestCart = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new CustomEvent("cartUpdated"));
};

export const computeGuestCartTotals = () => {
  const items = getGuestCart();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => {
    const p = i.discountPrice && i.discountPrice > 0 ? i.discountPrice : i.price;
    return s + p * i.quantity;
  }, 0);
  return { totalItems, subtotal, items };
};

// ============================================
// ❤️ FAVORITES
// ============================================

export interface IGuestFavoriteItem {
  productId: string;
  variantId: string | null;
  addedAt: string;

  title: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category?: string;
  brand?: string;
  images: string[];
  isActive?: boolean;
  nameBn?: string;
}

export const saveGuestFavorites = (items: IGuestFavoriteItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("favoriteUpdated"));
};

export const getGuestFavorites = (): IGuestFavoriteItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const addGuestFavorite = (item: Omit<IGuestFavoriteItem, "addedAt">) => {
  const items = getGuestFavorites();
  const exists = items.some(
    (i) =>
      i.productId === item.productId &&
      (i.variantId || null) === (item.variantId || null)
  );
  if (!exists) {
    items.push({ ...item, addedAt: new Date().toISOString() });
    saveGuestFavorites(items);
  }
  return items;
};

export const removeGuestFavorite = (
  productId: string,
  variantId: string | null
) => {
  const items = getGuestFavorites().filter(
    (i) =>
      !(
        i.productId === productId &&
        (i.variantId || null) === (variantId || null)
      )
  );
  saveGuestFavorites(items);
  return items;
};

export const clearGuestFavorites = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(FAVORITE_KEY);
  window.dispatchEvent(new CustomEvent("favoriteUpdated"));
};