// components/layout/Cart/CartItem.tsx
import { Link } from "react-router";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CartItemProps {
  item: any;
  onUpdateQuantity: (
    productId: string,
    variantId: string | null,
    qty: number
  ) => Promise<void>;
  onRemove: (productId: string, variantId: string | null) => Promise<void>;
  isUpdating?: boolean;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
}: CartItemProps) {
  const productId =
    typeof item?.productId === "object"
      ? item?.productId?._id
      : item?.productId;

  if (!productId) return null;

  const isProductObject = typeof item.productId === "object";

  // ✅ Title
  const title =
    item.title ||
    (isProductObject ? item.productId?.title : "") ||
    "Product";

  // ✅ Image
  const images =
    item.images ||
    (isProductObject ? item.productId?.images : []) ||
    [];

  let image = images[0];
  if (!image && item.image) image = item.image;
  if (!image && isProductObject && item.productId?.images?.[0]) {
    image = item.productId.images[0];
  }
  if (!image) image = "https://via.placeholder.com/150?text=No+Image";

  // ✅ Price logic
  const regularPrice = item.price ?? item.priceSnapshot ?? 0;
  const discountPrice = item.discountPrice ?? 0;
  const hasDiscount = discountPrice > 0 && discountPrice < regularPrice;
  const effectivePrice = hasDiscount ? discountPrice : regularPrice;
  const subtotal = effectivePrice * item.quantity;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - discountPrice) / regularPrice) * 100)
    : 0;

  // ✅ Stock
  const maxQty =
    item.stock ??
    (isProductObject ? item.productId?.stock : 99) ??
    99;

  // ✅ Category
  const category =
    item.category ||
    (isProductObject ? item.productId?.category : "") ||
    "";

  return (
    <div className="flex items-center gap-3 sm:gap-4 py-4 border-b border-border/40 last:border-0">
      {/* Image */}
      <Link
        to={`/alldata/${productId}`}
        className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900"
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/alldata/${productId}`}
          className="block text-xs sm:text-sm font-medium text-foreground line-clamp-2 hover:text-rose-600 transition-colors"
        >
          {title}
        </Link>

        {category && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {category}
          </p>
        )}

        {item.variantId && (
          <p className="text-[10px] text-muted-foreground">
            Variant: {item.variantId}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
          {hasDiscount ? (
            <>
              <p className="text-sm font-bold text-rose-600">
                ৳{effectivePrice.toLocaleString()}
              </p>
              <span className="text-[11px] text-muted-foreground/70 line-through">
                ৳{regularPrice.toLocaleString()}
              </span>
              <Badge className="text-[9px] bg-rose-100 text-rose-700 border-0 px-1.5 py-0 h-4">
                -{discountPercent}%
              </Badge>
            </>
          ) : (
            <p className="text-sm font-semibold text-rose-600">
              ৳{effectivePrice.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center border border-border/60 rounded-xl bg-background h-9 flex-shrink-0">
        <button
          onClick={() =>
            onUpdateQuantity(productId, item.variantId || null, item.quantity - 1)
          }
          disabled={isUpdating || item.quantity <= 1}
          className="px-2 h-full hover:bg-stone-100 dark:hover:bg-stone-800 text-muted-foreground disabled:opacity-40 transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="px-2.5 text-xs font-medium min-w-[28px] text-center">
          {isUpdating ? (
            <Loader2 className="w-3 h-3 animate-spin mx-auto" />
          ) : (
            item.quantity
          )}
        </span>
        <button
          onClick={() =>
            onUpdateQuantity(productId, item.variantId || null, item.quantity + 1)
          }
          disabled={isUpdating || item.quantity >= maxQty}
          className="px-2 h-full hover:bg-stone-100 dark:hover:bg-stone-800 text-muted-foreground disabled:opacity-40 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Subtotal (desktop) */}
      <div className="hidden sm:block w-24 text-right text-sm font-semibold flex-shrink-0">
        ৳{subtotal.toLocaleString()}
      </div>

      {/* Remove */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(productId, item.variantId || null)}
        disabled={isUpdating}
        className="h-8 w-8 flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}