// hooks/useFavorite.ts
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  useAddFavoriteMutation,
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "@/redux/features/favorite/favorite.api";
import { getGuestFavorites, saveGuestFavorites } from "@/lib/guestStorage";
import { useSessionId } from "@/hooks/useSessionId";

interface ToggleFavoriteOptions {
  productId: string;
  variantId?: string | null;
  productName?: string;
  productData?: {
    title: string;
    image: string;
    price: number;
  };
}

export const useFavorite = () => {
  const { isLoggedIn } = useSessionId();
  const [addFavMutation] = useAddFavoriteMutation();
  const [removeFavMutation] = useRemoveFavoriteMutation();
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const { data: favorites } = useGetFavoritesQuery(undefined, {
    skip: !isLoggedIn,
  });

  const isFavorite = useCallback(
    (productId: string, variantId?: string | null): boolean => {
      if (!isLoggedIn) {
        const items = getGuestFavorites();
        return items.some(
          (i: any) =>
            i.productId === productId &&
            (i.variantId || null) === (variantId || null)
        );
      }

      return (
        favorites?.items?.some(
          (i: any) =>
            (i.productId?._id || i.productId) === productId &&
            (i.variantId || null) === (variantId || null)
        ) || false
      );
    },
    [favorites, isLoggedIn]
  );

  const toggleFavorite = useCallback(
    async ({
      productId,
      variantId = null,
      productName,
      productData,
    }: ToggleFavoriteOptions): Promise<boolean> => {
      if (loadingIds.has(productId)) return false;
      setLoadingIds((prev) => new Set(prev).add(productId));

      try {
        const alreadyFav = isFavorite(productId, variantId);

        // ✅ GUEST
        if (!isLoggedIn) {
          let items = getGuestFavorites();
          if (alreadyFav) {
            items = items.filter(
              (i: any) =>
                !(
                  i.productId === productId &&
                  (i.variantId || null) === (variantId || null)
                )
            );
            saveGuestFavorites(items);
            toast.success(`${productName || "Item"} removed from favorites 💔`);
          } else {
            items.push({
              productId,
              variantId,
              title: productData?.title || "Product",
              image: productData?.image || "",
              price: productData?.price || 0,
            });
            saveGuestFavorites(items);
            toast.success(`${productName || "Item"} added to favorites ❤️`);
          }
          return !alreadyFav;
        }

        // ✅ LOGGED-IN
        if (alreadyFav) {
          await removeFavMutation({ productId, variantId }).unwrap();
          toast.success(`${productName || "Item"} removed from favorites 💔`);
          return false;
        } else {
          await addFavMutation({ productId, variantId }).unwrap();
          toast.success(`${productName || "Item"} added to favorites ❤️`);
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
    [addFavMutation, removeFavMutation, isFavorite, isLoggedIn, loadingIds]
  );

  return {
    toggleFavorite,
    isFavorite,
    isTogglingId: (id: string) => loadingIds.has(id),
  };
};