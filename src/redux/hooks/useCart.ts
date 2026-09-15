// hooks/useCart.ts
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAddToCartMutation } from "@/redux/features/cart/cart.api";
import { getGuestCart, saveGuestCart } from "@/lib/guestStorage";
import { useSessionId } from "@/hooks/useSessionId";

interface AddToCartOptions {
  productId: string;
  variantId?: string | null;
  quantity?: number;
  productName?: string;
  productData?: {
    title: string;
    image: string;
    price: number;
  };
}

export const useCart = () => {
  const { isLoggedIn } = useSessionId();
  const [addToCartMutation] = useAddToCartMutation();
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const addToCart = useCallback(
    async ({
      productId,
      variantId = null,
      quantity = 1,
      productName,
      productData,
    }: AddToCartOptions): Promise<boolean> => {
      if (loadingIds.has(productId)) return false;
      setLoadingIds((prev) => new Set(prev).add(productId));

      try {
        // ✅ GUEST
        if (!isLoggedIn) {
          const items = getGuestCart();
          const idx = items.findIndex(
            (i: any) =>
              i.productId === productId &&
              (i.variantId || null) === (variantId || null)
          );

          if (idx > -1) {
            items[idx].quantity += quantity;
          } else {
            items.push({
              productId,
              variantId,
              quantity,
              title: productData?.title || "Product",
              image: productData?.image || "",
              price: productData?.price || 0,
            });
          }

          saveGuestCart(items);
          toast.success(`${productName || "Item"} added to cart 🛒`);
          return true;
        }

        // ✅ LOGGED-IN
        await addToCartMutation({ productId, variantId, quantity }).unwrap();
        toast.success(`${productName || "Item"} added to cart 🛒`);
        return true;
      } catch (error: any) {
        console.error("❌ Add to cart error:", error);
        toast.error(error?.data?.message || "Failed to add to cart");
        return false;
      } finally {
        setLoadingIds((prev) => {
          const s = new Set(prev);
          s.delete(productId);
          return s;
        });
      }
    },
    [addToCartMutation, isLoggedIn, loadingIds]
  );

  return {
    addToCart,
    isLoading: loadingIds.size > 0,
    isAddingId: (id: string) => loadingIds.has(id),
  };
};