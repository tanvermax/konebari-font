// hooks/useFavorite.ts
import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useAddFavoriteMutation,
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "@/redux/features/favorite/favorite.api";
import {
  addGuestFavorite,
  getGuestFavorites,
  removeGuestFavorite,
} from "@/lib/guestStorage";
import { useSessionId } from "./useSessionId";

interface ToggleFavoriteOptions {
  productId: string;
  variantId?: string | null;
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
  };
  productName?: string;
}

export const useFavorite = () => {
  const { isLoggedIn } = useSessionId();
  const [addFavMutation] = useAddFavoriteMutation();
  const [removeFavMutation] = useRemoveFavoriteMutation();
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [guestVersion, setGuestVersion] = useState(0);

  const { data: apiFavorites, refetch } = useGetFavoritesQuery(undefined, {
    skip: !isLoggedIn,
  });


// 2. Guest favorites check
console.log("Favorites:", JSON.parse(localStorage.getItem("guest_favorites_v2") || "[]"));


  useEffect(() => {
    const handler = () => setGuestVersion((v) => v + 1);
    window.addEventListener("favoriteUpdated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("favoriteUpdated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const isFavorite = useCallback(
    (productId: string, variantId?: string | null): boolean => {
      if (!isLoggedIn) {
        const items = getGuestFavorites();
        return items.some(
          (i) =>
            i.productId === productId &&
            (i.variantId || null) === (variantId || null)
        );
      }
      return (
        apiFavorites?.items?.some(
          (i: any) =>
            (i.productId?._id || i.productId) === productId &&
            (i.variantId || null) === (variantId || null)
        ) || false
      );
    },
    [isLoggedIn, apiFavorites, guestVersion]
  );

  const toggleFavorite = useCallback(
    async ({
      productId,
      variantId = null,
      product,
      productName,
    }: ToggleFavoriteOptions): Promise<boolean> => {
      if (loadingIds.has(productId)) return false;
      setLoadingIds((prev) => new Set(prev).add(productId));

      try {
        const alreadyFav = isFavorite(productId, variantId);

        if (!isLoggedIn) {
          if (alreadyFav) {
            removeGuestFavorite(productId, variantId);
            toast.success(
              `${product?.title || productName} removed from favorites 💔`
            );
          } else {
            addGuestFavorite({
              productId,
              variantId,
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
            });
            toast.success(
              `${product?.title || productName} added to favorites ❤️`
            );
          }
          setGuestVersion((v) => v + 1);
          return !alreadyFav;
        }

        if (alreadyFav) {
          await removeFavMutation({ productId, variantId }).unwrap();
          toast.success(
            `${product?.title || productName} removed from favorites 💔`
          );
          refetch();
          return false;
        } else {
          await addFavMutation({ productId, variantId }).unwrap();
          toast.success(
            `${product?.title || productName} added to favorites ❤️`
          );
          refetch();
          return true;
        }
      } catch (error: any) {
        console.error("❌ Favorite error:", error);
        toast.error(error?.data?.message || "Failed to update favorites");
        return false;
      } finally {
        setLoadingIds((prev) => {
          const s = new Set(prev);
          s.delete(productId);
          return s;
        });
      }
    },
    [addFavMutation, removeFavMutation, isFavorite, isLoggedIn, loadingIds, refetch]
  );

  return {
    toggleFavorite,
    isFavorite,
    isTogglingId: (id: string) => loadingIds.has(id),
  };
};