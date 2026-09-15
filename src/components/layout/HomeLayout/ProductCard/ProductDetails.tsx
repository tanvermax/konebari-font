// components/HomeLayout/ProductCard/ProductDetails.tsx
"use client";
import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  ShoppingBag,
  ArrowRight,
  Heart,
  Loader2,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { usePricestockDetailsQuery } from "@/redux/features/product/product.api";
import { useNavigate, useParams } from "react-router";
import { useCart } from "@/redux/hooks/useCart";
import { useFavorite } from "@/redux/hooks/useFavorite";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { addToCart, isAddingId } = useCart();
  const { toggleFavorite, isFavorite, isTogglingId } = useFavorite();

  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const { data: product, isLoading } = usePricestockDetailsQuery(id) as any;

  // ✅ Handle variants (may be empty)
  const activeVariants = useMemo(
    () =>
      (product?.variants || []).filter(
        (v: any) => v.status === "active"
      ),
    [product]
  );

  const selectedVariant = activeVariants[selectedVariantIdx];

  // ✅ Images — mainImage OR images[0]
  const allImages = useMemo(() => {
    if (!product) return [];
    const imgs = [
      product.mainImage,
      ...(product.images || []),
      selectedVariant?.image,
      ...(selectedVariant?.images || []),
    ].filter(Boolean);
    return Array.from(new Set(imgs)) as string[];
  }, [product, selectedVariant]);

  // ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6">
            <Skeleton className="aspect-square w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Package className="w-12 h-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground font-light text-sm">
            প্রোডাক্টটি পাওয়া যায়নি।
          </p>
          <Button onClick={() => navigate("/shop")} variant="outline">
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  // ✅ Price & Stock logic — handle empty variants
  const displayPrice = selectedVariant?.price ?? product.price ?? product.minPrice ?? 0;
  const displaySpecialPrice =
    selectedVariant?.specialPrice ??
    (product.discountPrice > 0 ? product.discountPrice : null);
  const hasDiscount =
    displaySpecialPrice != null && displaySpecialPrice < displayPrice;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((displayPrice - (displaySpecialPrice as number)) / displayPrice) * 100
      )
    : 0;

  const stockCount = selectedVariant?.quantity ?? product.stock ?? product.totalStock ?? 0;
  const inStock = stockCount > 0;

  const favActive = isFavorite(product._id, selectedVariant?.skuId || null);
  const isAdding = isAddingId(product._id);
  const isToggling = isTogglingId(product._id);

  // ✅ Handlers
  const handleAddToCart = async (redirect = false) => {
    const ok = await addToCart({
      productId: product._id,
      variantId: selectedVariant?.skuId || null,
      quantity,
      productName: product.title,
      productData: {
        title: product.title,
        image: allImages[0] || "",
        price: hasDiscount ? (displaySpecialPrice as number) : displayPrice,
      },
    });
    if (ok && redirect) navigate("/cart");
    return ok;
  };

  const handleToggleFavorite = async () => {
    await toggleFavorite({
      productId: product._id,
      variantId: selectedVariant?.skuId || null,
      productName: product.title,
      productData: {
        title: product.title,
        image: allImages[0] || "",
        price: hasDiscount ? (displaySpecialPrice as number) : displayPrice,
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">

        {/* ✅ GALLERY */}
        <div className="lg:col-span-6 space-y-3 lg:sticky lg:top-6">
          <div className="relative group rounded-2xl overflow-hidden border border-border/40 bg-stone-50 dark:bg-stone-900/50 aspect-square">
            <img
              src={allImages[activeImg] || "/placeholder-image.png"}
              alt={product.title}
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />

            {/* Navigation */}
            {allImages.length > 1 && (
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-8 w-8 sm:h-9 sm:w-9 bg-white/80 dark:bg-black/60 backdrop-blur-md shadow-sm"
                  onClick={() =>
                    setActiveImg((p) => (p === 0 ? allImages.length - 1 : p - 1))
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-8 w-8 sm:h-9 sm:w-9 bg-white/80 dark:bg-black/60 backdrop-blur-md shadow-sm"
                  onClick={() =>
                    setActiveImg((p) => (p === allImages.length - 1 ? 0 : p + 1))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* ❤️ Favorite button on image */}
            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={isToggling}
              aria-label="Toggle favorite"
              className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md shadow-md hover:scale-110 active:scale-95 transition-all disabled:opacity-70 z-10"
            >
              {isToggling ? (
                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
              ) : (
                <Heart
                  className={`w-4 h-4 transition-all ${
                    favActive
                      ? "fill-rose-500 text-rose-500 scale-110"
                      : "text-stone-600 dark:text-stone-300"
                  }`}
                />
              )}
            </button>

            {!inStock && (
              <Badge
                variant="destructive"
                className="absolute top-4 left-4 rounded-full font-normal text-xs"
              >
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl border transition-all overflow-hidden p-1 bg-stone-50 dark:bg-stone-900 ${
                    activeImg === idx
                      ? "border-rose-500 ring-1 ring-rose-500"
                      : "border-border/40 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt="Thumbnail"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ✅ INFO */}
        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          <header className="space-y-2">
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-rose-500 uppercase">
              {product.category || "Authentic Beauty"}
            </span>

            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-tight text-foreground leading-tight">
                {product.title}
              </h1>

              {/* Favorite (Secondary) */}
              <button
                type="button"
                onClick={handleToggleFavorite}
                disabled={isToggling}
                aria-label="Toggle favorite"
                className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all disabled:opacity-70"
              >
                <Heart
                  className={`w-4 h-4 transition-all ${
                    favActive ? "fill-rose-500 text-rose-500" : "text-stone-500"
                  }`}
                />
              </button>
            </div>

            {product.nameBn && (
              <p className="text-muted-foreground font-light text-sm sm:text-base">
                {product.nameBn}
              </p>
            )}
          </header>

          {/* ✅ Pricing */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-border/40 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-baseline gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-2xl sm:text-3xl font-semibold text-foreground">
                    ৳{Number(displaySpecialPrice).toLocaleString()}
                  </span>
                  <span className="text-sm font-light text-muted-foreground line-through">
                    ৳{Number(displayPrice).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-2xl sm:text-3xl font-semibold text-foreground">
                  ৳{Number(displayPrice).toLocaleString()}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <span className="bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs px-3 py-1 rounded-full font-medium border border-rose-200/50 dark:border-rose-900/30">
                Save {discountPercentage}%
              </span>
            )}
          </div>

          {/* ✅ Stock info */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Package className="w-3.5 h-3.5" />
              <span>{inStock ? `${stockCount} in stock` : "Out of stock"}</span>
            </div>
            {product.brand && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{product.brand}</span>
              </div>
            )}
          </div>

          {/* ✅ Variants */}
          {activeVariants.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Options
              </span>
              <div className="flex flex-wrap gap-2">
                {activeVariants.map((v: any, idx: number) => (
                  <button
                    key={v.skuId}
                    onClick={() => {
                      setSelectedVariantIdx(idx);
                      setActiveImg(0);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      selectedVariantIdx === idx
                        ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                        : "border-border/60 text-muted-foreground hover:border-border"
                    } ${v.quantity <= 0 ? "opacity-40 line-through" : ""}`}
                    disabled={v.quantity <= 0}
                  >
                    {v.combo || v.skuId}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Quantity + Actions */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-border/60 rounded-xl bg-background h-11">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="px-3 h-full hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium transition-colors text-muted-foreground disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-3 font-medium text-sm text-foreground min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(stockCount || 1, q + 1))
                  }
                  disabled={quantity >= stockCount}
                  className="px-3 h-full hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium transition-colors text-muted-foreground disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                variant="outline"
                onClick={() => handleAddToCart(false)}
                disabled={!inStock || isAdding}
                className="flex-1 h-11 border-border/60 rounded-xl text-xs sm:text-sm font-normal gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-300"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} /> Add to Cart
                  </>
                )}
              </Button>
            </div>

            {/* Buy Now */}
            <Button
              onClick={() => handleAddToCart(true)}
              disabled={!inStock || isAdding}
              className="w-full h-11 bg-slate-900 dark:bg-rose-600 hover:bg-slate-800 dark:hover:bg-rose-700 text-white font-normal text-xs sm:text-sm rounded-xl gap-2 transition-all"
            >
              {inStock ? (
                <>
                  Buy Now <ArrowRight size={15} />
                </>
              ) : (
                "Out of Stock"
              )}
            </Button>
          </div>

          {/* ✅ Trust badges */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/40">
            <div className="text-center space-y-1">
              <Truck className="w-4 h-4 mx-auto text-rose-500" />
              <p className="text-[10px] text-muted-foreground">Fast Delivery</p>
            </div>
            <div className="text-center space-y-1">
              <ShieldCheck className="w-4 h-4 mx-auto text-rose-500" />
              <p className="text-[10px] text-muted-foreground">Authentic</p>
            </div>
            <div className="text-center space-y-1">
              <Package className="w-4 h-4 mx-auto text-rose-500" />
              <p className="text-[10px] text-muted-foreground">Easy Return</p>
            </div>
          </div>

          {/* ✅ Highlights */}
          {product.shortDescription && (
            <div className="space-y-2 border-t border-border/40 pt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Info size={14} className="text-rose-500" /> Highlights
              </h3>
              <div
                className="prose prose-sm max-w-none text-muted-foreground font-light text-xs sm:text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.shortDescription }}
              />
            </div>
          )}

          {/* ✅ Description */}
          {product.description && (
            <div className="space-y-2 border-t border-border/40 pt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </h3>
              <div
                className="prose prose-sm max-w-none text-muted-foreground font-light text-xs sm:text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;