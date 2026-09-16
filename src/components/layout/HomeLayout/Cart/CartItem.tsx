// components/layout/Cart/CartItem.tsx
import { Link } from "react-router";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: {
    productId: string | { _id: string; title?: string; images?: string[] };
    variantId?: string | null;
    quantity: number;

    // ✅ Product fields (same as DB)
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

    // legacy
    priceSnapshot?: number;
    image?: string;
  };
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
  // ✅ Safe extraction
  const productId =
    typeof item?.productId === "object"
      ? item?.productId?._id
      : item?.productId;

  if (!productId) {
    console.warn("⚠️ CartItem invalid item:", item);
    return null;
  }

  // ✅ Same fields as DB
  const title =
    item.title ||
    (typeof item.productId === "object" ? item.productId?.title : "") ||
    "Product";

  const images =
    item.images ||
    (typeof item.productId === "object"
      ? item.productId?.images
      : undefined) ||
    [];

  const image = images[0] || "https://via.placeholder.com/150";

  // ✅ Effective price (discount if available)
  const basePrice = item.price ?? item.priceSnapshot ?? 0;
  const effectivePrice =
    item.discountPrice && item.discountPrice > 0
      ? item.discountPrice
      : basePrice;

  const subtotal = effectivePrice * item.quantity;
  const maxQty = item.stock || 99;
  const hasDiscount = item.discountPrice && item.discountPrice > 0;

  return (
    <div className="flex items-center gap-3 sm:gap-4 py-4 border-b border-border/40 last:border-0">

      <Link
        to={`/alldata/${productId}`}
        className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900"
      >
        <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/alldata/${productId}`}
          className="block text-xs sm:text-sm font-medium text-foreground line-clamp-2 hover:text-rose-600 transition-colors"
        >
          {title}
        </Link>

        {item.category && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {item.category}
          </p>
        )}

        {item.variantId && (
          <p className="text-[10px] text-muted-foreground">
            Variant: {item.variantId}
          </p>
        )}

        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-xs sm:text-sm font-semibold text-rose-600">
            ৳{effectivePrice.toLocaleString()}
          </p>
          {hasDiscount && (
            <span className="text-[10px] text-muted-foreground line-through">
              ৳{basePrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center border border-border/60 rounded-xl bg-background h-9 flex-shrink-0">
        <button
          onClick={() => onUpdateQuantity(productId, item.variantId || null, item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          className="px-2 h-full hover:bg-stone-100 dark:hover:bg-stone-800 text-muted-foreground disabled:opacity-40 transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="px-2.5 text-xs font-medium min-w-[28px] text-center">
          {isUpdating ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(productId, item.variantId || null, item.quantity + 1)}
          disabled={isUpdating || item.quantity >= maxQty}
          className="px-2 h-full hover:bg-stone-100 dark:hover:bg-stone-800 text-muted-foreground disabled:opacity-40 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <div className="hidden sm:block w-24 text-right text-sm font-semibold flex-shrink-0">
        ৳{subtotal.toLocaleString()}
      </div>

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