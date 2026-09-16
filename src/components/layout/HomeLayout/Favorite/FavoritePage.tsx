// components/layout/Favorite/FavoritePage.tsx
"use client";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Heart,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFavoritesQuery } from "@/redux/features/favorite/favorite.api";
import {
  getGuestFavorites,
  clearGuestFavorites,
} from "@/lib/guestStorage";
import FavoriteCard from "./FavoriteCard";
import { useSessionId } from "@/redux/hooks/useSessionId";
import { useFavorite } from "@/redux/hooks/useFavorite";
import FavoriteEmpty from "@/card/FavoriteEmpty";

export default function FavoritePage() {
  const { isLoggedIn } = useSessionId();
  const { toggleFavorite } = useFavorite();
  const [guestItems, setGuestItems] = useState<any[]>([]);
  const [guestVersion, setGuestVersion] = useState(0);

  // ✅ API query — only logged-in
  const {
    data: apiData,
    isLoading: apiLoading,
    refetch: refetchApi,
  } = useGetFavoritesQuery(undefined, {
    skip: !isLoggedIn,
    refetchOnMountOrArgChange: true,
  });

  // ✅ Guest — localStorage
  useEffect(() => {
    if (isLoggedIn) return;

    const load = () => {
      const items = getGuestFavorites();
      console.log("🔍 Guest favorites loaded:", items);
      setGuestItems(items);
    };
    load();

    window.addEventListener("favoriteUpdated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("favoriteUpdated", load);
      window.removeEventListener("storage", load);
    };
  }, [isLoggedIn, guestVersion]);

  // ✅ Unified items
  const items: any[] = isLoggedIn
    ? apiData?.items || apiData?.data?.items || []
    : guestItems;

  const totalItems = items.length;
  const isLoading = isLoggedIn ? apiLoading : false;

  // ✅ Clear all
  const handleClearAll = async () => {
    if (!window.confirm("Remove all items from your wishlist?")) return;

    if (!isLoggedIn) {
      clearGuestFavorites();
      setGuestItems([]);
      setGuestVersion((v) => v + 1);
      return;
    }

    for (const item of items) {
      const productId =
        typeof item.productId === "object"
          ? item.productId._id
          : item.productId;
      await toggleFavorite({
        productId,
        variantId: item.variantId || null,
        productName: "Item",
      });
    }
    refetchApi();
  };

  // ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <FavoriteEmpty />;
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              My Wishlist
            </h1>
            <p className="text-xs text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={handleClearAll}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1.5 text-xs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </Button>
      </div>

      {/* Info banner */}
      <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/60 dark:border-rose-900/30 rounded-xl px-4 py-3">
        <Sparkles className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
        <span>
          {isLoggedIn
            ? "Your favorites are saved to your account."
            : "Your favorites are saved on this device. Login to sync across devices."}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item: any, idx: number) => {
          const productId =
            typeof item.productId === "object"
              ? item.productId._id
              : item.productId;

          return (
            <FavoriteCard
              key={`${productId}-${item.variantId || "default"}-${idx}`}
              item={item}
              onRemoveSuccess={() => {
                if (isLoggedIn) refetchApi();
                else setGuestVersion((v) => v + 1);
              }}
            />
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Link to="/shop">
          <Button
            variant="outline"
            className="rounded-xl border-rose-200/60 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}