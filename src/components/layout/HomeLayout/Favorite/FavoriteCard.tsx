// components/layout/HomeLayout/Favorite/FavoriteCard.tsx
import { Link } from "react-router";
import { Heart, ShoppingBag, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { toast } from "sonner";
import { useCart } from "@/redux/hooks/useCart";
import { useFavorite } from "@/redux/hooks/useFavorite";

interface FavoriteCardProps {
  item: {
    _id?: string;
    productId:
      | string
      | {
          _id: string;
          title?: string;
          images?: string[];
          price?: number;
          discountPrice?: number;
          stock?: number;
          isActive?: boolean;
        };
    variantId?: string | null;

    // ✅ Guest snapshot fields
    title?: string;
    slug?: string;
    price?: number;
    discountPrice?: number;
    stock?: number;
    images?: string[];
    category?: string;
    brand?: string;
    isActive?: boolean;
    nameBn?: string;
  };
  onRemoveSuccess?: () => void;
}

export default function FavoriteCard({
  item,
  onRemoveSuccess,
}: FavoriteCardProps) {
  const { addToCart, isAddingId } = useCart();
  const { toggleFavorite, isTogglingId } = useFavorite();

  // ✅ Handle both shapes
  const productId =
    typeof item?.productId === "object"
      ? item.productId?._id
      : item?.productId;

  if (!productId) {
    console.warn("⚠️ FavoriteCard invalid item:", item);
    return null;
  }

  const isProductObject = typeof item.productId === "object";

  // ✅ Extract fields
  const title =
    item.title ||
    (isProductObject ? (item.productId as any)?.title : "") ||
    "Product";

  const images =
    item.images ||
    (isProductObject ? (item.productId as any)?.images : []) ||
    [];

  const image = images[0] || "https://via.placeholder.com/300x300?text=No+Image";

  const price =
    item.price ??
    (isProductObject ? (item.productId as any)?.price : 0) ??
    0;

  const discountPrice =
    item.discountPrice ??
    (isProductObject ? (item.productId as any)?.discountPrice : 0) ??
    0;

  const hasDiscount = discountPrice > 0 && discountPrice < price;
  const displayPrice = hasDiscount ? discountPrice : price;

  const discount = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const stock =
    item.stock ??
    (isProductObject ? (item.productId as any)?.stock : 0) ??
    0;

  const isActive =
    item.isActive !== undefined
      ? item.isActive
      : isProductObject
      ? (item.productId as any)?.isActive
      : true;

  const inStock = isActive !== false && stock > 0;

  const isRemoving = isTogglingId(productId);
  const isAdding = isAddingId(productId);

  // ✅ Remove from favorites
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await toggleFavorite({
      productId,
      variantId: item.variantId || null,
      productName: title,
    });
    onRemoveSuccess?.();
  };

  // ✅ Add to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) {
      toast.error("Product is out of stock");
      return;
    }

    await addToCart({
      productId,
      variantId: item.variantId || null,
      quantity: 1,
      productName: title,
      product: {
        _id: productId,
        title,
        slug: item.slug,
        price,
        discountPrice,
        stock,
        images,
        isActive,
      },
    });
  };

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:shadow-lg hover:border-rose-200/60 dark:hover:border-rose-900/40 flex flex-col">

      {/* Image */}
      <Link
        to={`/alldata/${productId}`}
        className="relative block aspect-square overflow-hidden bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-950"
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Discount badge */}
        {hasDiscount && discount > 0 && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow-md">
            -{discount}%
          </span>
        )}

        {/* Out of stock */}
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
      </Link>

      {/* Remove button (top-right) */}
      <button
        type="button"
        onClick={handleRemove}
        disabled={isRemoving}
        aria-label="Remove from favorites"
        className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md shadow-sm transition-all hover:scale-110 hover:bg-red-50 dark:hover:bg-red-950/40 active:scale-95 disabled:opacity-70 z-10 group/btn"
      >
        {isRemoving ? (
          <Loader2 size={14} className="animate-spin text-rose-500" />
        ) : (
          <>
            <Heart
              size={14}
              strokeWidth={2}
              className="fill-rose-500 text-rose-500 transition-all group-hover/btn:hidden"
            />
            <Trash2
              size={14}
              className="hidden text-red-500 group-hover/btn:block transition-all"
            />
          </>
        )}
      </button>

      {/* Info */}
      <div className="p-3 sm:p-3.5 space-y-2 flex-1 flex flex-col">
        {item.category && (
          <span className="text-[9px] font-semibold uppercase tracking-wider text-rose-500">
            {item.category}
          </span>
        )}

        <Link to={`/alldata/${productId}`} className="block">
          <h3 className="line-clamp-2 text-[12px] sm:text-[13px] font-medium text-foreground/90 transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400 min-h-[36px] leading-snug">
            {title}
          </h3>
        </Link>

        <div className="flex items-baseline justify-between pt-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-[15px] font-semibold text-foreground">
              ৳{displayPrice.toLocaleString()}
            </span>
            {hasDiscount && (
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

        {/* Add to Cart */}
        <Button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock || isAdding}
          className="w-full h-9 mt-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-medium rounded-xl shadow-sm transition-all"
        >
          {isAdding ? (
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