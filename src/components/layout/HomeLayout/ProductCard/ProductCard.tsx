// components/HomeLayout/ProductCard/ProductCard.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import { useFavorite } from "@/redux/hooks/useFavorite";
import { useCart } from "@/redux/hooks/useCart";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  specialPrice?: number;
  hasDiscount: boolean;
  inStock: boolean;
  image: string;
  slug?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  specialPrice,
  hasDiscount,
  inStock,
  image,
  slug,
}: ProductCardProps) {
  const { toggleFavorite, isFavorite, isTogglingId } = useFavorite();
  const { addToCart, isAddingId } = useCart();

  const favActive = isFavorite(id, null);
  const toggling = isTogglingId(id);
  const adding = isAddingId(id);

  const displayPrice =
    hasDiscount && specialPrice != null ? specialPrice : price;
  const discount =
    hasDiscount && specialPrice
      ? Math.round(((price - specialPrice) / price) * 100)
      : 0;

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite({
      productId: id,
      productName: name,
      productData: { title: name, image, price: displayPrice },
    });
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart({
      productId: id,
      variantId: null,
      quantity: 1,
      productName: name,
      productData: { title: name, image, price: displayPrice },
    });
  };

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:shadow-lg hover:border-rose-200/60 dark:hover:border-rose-900/40 flex flex-col">

      {/* ✅ Image Area */}
      <Link to={`/alldata/${id || slug}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-950">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Discount Badge */}
          {hasDiscount && discount > 0 && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow-md tracking-wide">
              -{discount}%
            </span>
          )}

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-background/55 backdrop-blur-[2px] flex items-center justify-center">
              <Badge
                variant="outline"
                className="bg-background/95 text-[10px] font-medium px-3 py-1 rounded-full border-border/60"
              >
                Sold Out
              </Badge>
            </div>
          )}
        </div>
      </Link>

      {/* ❤️ Cool Small Love Button (top-right, absolute) */}
      <button
        type="button"
        aria-label={favActive ? "Remove from favorites" : "Add to favorites"}
        onClick={handleToggleFavorite}
        disabled={toggling}
        className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md shadow-sm transition-all hover:scale-110 active:scale-95 disabled:opacity-70 z-10"
      >
        {toggling ? (
          <Loader2 size={14} className="animate-spin text-rose-500" />
        ) : (
          <Heart
            size={14}
            strokeWidth={2}
            className={`transition-all duration-300 ${
              favActive
                ? "fill-rose-500 text-rose-500 scale-110"
                : "text-stone-600 dark:text-stone-300"
            }`}
          />
        )}
      </button>

      {/* ✅ Info */}
      <div className="p-3 sm:p-3.5 space-y-2 flex-1 flex flex-col">
        <Link to={`/alldata/${id || slug}`} className="block">
          <h3 className="line-clamp-2 text-[12px] sm:text-[13px] font-medium text-foreground/90 transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400 min-h-[36px] leading-snug tracking-tight">
            {name}
          </h3>
        </Link>

        <div className="flex items-baseline justify-between pt-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-[15px] font-semibold text-foreground">
              ৳{displayPrice.toLocaleString()}
            </span>
            {hasDiscount && specialPrice != null && (
              <span className="text-[11px] text-muted-foreground line-through font-light">
                ৳{price.toLocaleString()}
              </span>
            )}
          </div>

          {inStock && (
            <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-900/30">
              In Stock
            </span>
          )}
        </div>

        {/* ✅ Add to Cart Button */}
        <Button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock || adding}
          className="w-full h-9 mt-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-medium rounded-xl shadow-sm transition-all"
        >
          {adding ? (
            <>
              <Loader2 size={14} className="mr-1.5 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingBag size={14} className="mr-1.5" />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}