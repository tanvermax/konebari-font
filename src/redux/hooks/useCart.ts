// hooks/useCart.ts
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAddToCartMutation } from "@/redux/features/cart/cart.api";
import { addGuestCartItem } from "@/lib/guestStorage";
import { useSessionId } from "./useSessionId";

interface AddToCartOptions {
  productId: string;
  variantId?: string | null;
  quantity?: number;
  product?: {
    _id?: string;
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
  };
  productName?: string;
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
      product,
      productName,
    }: AddToCartOptions): Promise<boolean> => {
      if (loadingIds.has(productId)) return false;
      setLoadingIds((prev) => new Set(prev).add(productId));

      try {
        if (!isLoggedIn) {
          addGuestCartItem({
            productId,
            variantId,
            quantity,
            title: product?.title || productName || "Product",
            slug: product?.slug,
            description: product?.description,
            shortDescription: product?.shortDescription,
            price: product?.price || 0,
            discountPrice: product?.discountPrice,
            stock: product?.stock || 0,
            category: product?.category,
            brand: product?.brand,
            images: product?.images || [],
            isActive: product?.isActive,
            nameBn: product?.nameBn,
            variants: product?.variants || [],
          });
          toast.success(`${product?.title || productName} added to cart 🛒`);
          return true;
        }

        await addToCartMutation({ productId, variantId, quantity }).unwrap();
        toast.success(`${product?.title || productName} added to cart 🛒`);
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