// hooks/useCartActions.ts
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
  useClearCartMutation,
} from "@/redux/features/cart/cart.api";
import {
  updateGuestCartQuantity,
  removeGuestCartItem,
  clearGuestCart,
  computeGuestCartTotals,
} from "@/lib/guestStorage";
import { useSessionId } from "./useSessionId";

export const useCartActions = () => {
  const { isLoggedIn } = useSessionId();
  const [version, setVersion] = useState(0);

  const {
    data: apiCart,
    isLoading: isApiLoading,
    refetch: refetchApi,
  } = useGetCartQuery(undefined, { skip: !isLoggedIn });

  const [removeMutation] = useRemoveCartItemMutation();
  const [updateMutation] = useUpdateCartItemMutation();
  const [clearMutation] = useClearCartMutation();

  // ✅ Listen for localStorage + version updates
  useEffect(() => {
    const handler = () => setVersion((v) => v + 1);
    window.addEventListener("cartUpdated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("cartUpdated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const cart = (() => {
    if (isLoggedIn) {
      const items = (apiCart?.items || [])
        .map((i: any) => ({
          ...i,
          productId:
            typeof i.productId === "object" ? i.productId._id : i.productId,
        }))
        .filter((i: any) => i.productId);

      return {
        items,
        totalItems: apiCart?.totalItems || 0,
        subtotal: apiCart?.subtotal || 0,
      };
    }
    const { items, totalItems, subtotal } = computeGuestCartTotals();
    return { items, totalItems, subtotal };
  })();

  const removeItem = useCallback(
    async (productId: string, variantId?: string | null) => {
      try {
        if (!isLoggedIn) {
          removeGuestCartItem(productId, variantId || null);
          setVersion((v) => v + 1);
          toast.success("Item removed");
          return;
        }
        await removeMutation({ productId, variantId: variantId || null }).unwrap();
        toast.success("Item removed");
        refetchApi();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to remove item");
      }
    },
    [isLoggedIn, removeMutation, refetchApi]
  );

  const updateQuantity = useCallback(
    async (productId: string, variantId: string | null, quantity: number) => {
      try {
        if (!isLoggedIn) {
          updateGuestCartQuantity(productId, variantId, quantity);
          setVersion((v) => v + 1);
          return;
        }
        await updateMutation({ productId, variantId: variantId || null, quantity }).unwrap();
        refetchApi();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to update quantity");
      }
    },
    [isLoggedIn, updateMutation, refetchApi]
  );

  const clearCart = useCallback(async () => {
    try {
      if (!isLoggedIn) {
        clearGuestCart();
        setVersion((v) => v + 1);
        return;
      }
      await clearMutation(undefined).unwrap();
      refetchApi();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to clear cart");
    }
  }, [isLoggedIn, clearMutation, refetchApi]);

  return {
    cart,
    isLoading: isLoggedIn ? isApiLoading : false,
    refetch: refetchApi,
    removeItem,
    updateQuantity,
    clearCart,
  };
};