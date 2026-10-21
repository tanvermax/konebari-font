// components/HomeLayout/ProductCard/ProductDetails.tsx
"use client";
import { useState, useMemo, useEffect } from "react";
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
  CheckCircle2,
} from "lucide-react";
import {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
} from "@/redux/features/review/review.api";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useSessionId } from "@/redux/hooks/useSessionId";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePricestockDetailsQuery } from "@/redux/features/product/product.api";
import { useNavigate, useParams } from "react-router";
import { useCart } from "@/redux/hooks/useCart";
import { useFavorite } from "@/redux/hooks/useFavorite";
import { toast } from "sonner";
import ShareButton from "@/components/shared/ShareButton";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { addToCart, isAddingId } = useCart();
  const { toggleFavorite, isFavorite, isTogglingId } = useFavorite();

  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const { data: product, isLoading } = usePricestockDetailsQuery(id) as any;

  // ... ProductDetails component er vitor
  const { isLoggedIn } = useSessionId();
  const { data: reviews = [] } = useGetProductReviewsQuery(product?._id || "", {
    skip: !product?._id,
  });
  const [createReview, { isLoading: isReviewSubmitting }] =
    useCreateReviewMutation();

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to submit a review");
      return;
    }
    if (!product?._id) return;
    if (!newComment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      await createReview({
        productId: product._id,
        rating: newRating,
        comment: newComment.trim(),
      }).unwrap();
      toast.success("Review submitted! 🎉");
      setNewComment("");
      setNewRating(5);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  // ============================================
  // ✅ VARIANTS
  // ============================================
  const activeVariants = useMemo(
    () => (product?.variants || []).filter((v: any) => v.status === "active"),
    [product],
  );

  const selectedVariant = activeVariants[selectedVariantIdx];

  // ============================================
  // ✅ PRICE CALCULATION
  // ============================================
  const regularPrice = Number(selectedVariant?.price ?? product?.price ?? 0);

  const specialPrice = Number(
    selectedVariant?.specialPrice ?? product?.discountPrice ?? 0,
  );

  const hasDiscount = specialPrice > 0 && specialPrice < regularPrice;

  const displayPrice = hasDiscount ? specialPrice : regularPrice;

  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - displayPrice) / regularPrice) * 100)
    : 0;

  // ============================================
  // ✅ STOCK
  // ============================================
  const stockCount =
    selectedVariant?.quantity ?? product?.stock ?? product?.totalStock ?? 0;

  const inStock = stockCount > 0;

  // ============================================
  // ✅ IMAGES
  // ============================================
  const allImages = useMemo(() => {
    if (!product) return [];
    const imgs = [
      ...(product.images || []),
      selectedVariant?.image,
      ...(selectedVariant?.images || []),
    ].filter(Boolean);
    return Array.from(new Set(imgs)) as string[];
  }, [product, selectedVariant]);

  // Reset active image and quantity when variant changes
  useEffect(() => {
    setActiveImg(0);
    setQuantity(1);
  }, [selectedVariantIdx]);

  // ============================================
  // ✅ FAVORITE STATUS
  // ============================================
  const favActive = isFavorite(product?._id, selectedVariant?.skuId || null);
  const isAdding = isAddingId(product?._id);
  const isToggling = isTogglingId(product?._id);

  // ============================================
  // ✅ HANDLERS
  // ============================================
  const handleAddToCart = async (redirect = false) => {
    if (!product) return false;

    console.log("🛒 Adding to cart with:", {
      regularPrice,
      specialPrice,
      selectedVariantId: selectedVariant?.skuId,
    });

    const ok = await addToCart({
      productId: product._id,
      variantId: selectedVariant?.skuId || null,
      quantity,
      productName: product.title,
      product: {
        _id: product._id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        price: regularPrice,
        discountPrice: hasDiscount ? specialPrice : 0,
        stock: stockCount,
        category: product.category,
        brand: product.brand,
        images: allImages,
        isActive: product.isActive,
        nameBn: product.nameBn,
        variants: product.variants || [],
        // ✅ Payment options pass
        allowCashOnDelivery: product.allowCashOnDelivery ?? true,
        allowOnlinePayment: product.allowOnlinePayment ?? true,
      },
    });
    if (ok && redirect) navigate("/cart");
    return ok;
  };

  const handleToggleFavorite = async () => {
    if (!product) return;

    await toggleFavorite({
      productId: product._id,
      variantId: selectedVariant?.skuId || null,
      productName: product.title,
      product: {
        _id: product._id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        price: regularPrice,
        discountPrice: hasDiscount ? specialPrice : 0,
        stock: stockCount,
        category: product.category,
        brand: product.brand,
        images: allImages,
        isActive: product.isActive,
        nameBn: product.nameBn,
      },
    });
  };

  // ============================================
  // ✅ LOADING
  // ============================================
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

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 md:py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        {/* ============================================
            LEFT: IMAGE GALLERY
           ============================================ */}
        <div className="lg:col-span-6 space-y-3 lg:sticky lg:top-6">
          {/* Main Image */}
          <div className="relative group rounded-2xl overflow-hidden border border-border/40 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900/50 dark:to-stone-900/80 aspect-square">
            <img
              src={allImages[activeImg] || "/placeholder-image.png"}
              alt={product.title}
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />

            {/* Image Navigation */}
            {allImages.length > 1 && (
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-8 w-8 sm:h-9 sm:w-9 bg-white/80 dark:bg-black/60 backdrop-blur-md shadow-sm"
                  onClick={() =>
                    setActiveImg((p) =>
                      p === 0 ? allImages.length - 1 : p - 1,
                    )
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-8 w-8 sm:h-9 sm:w-9 bg-white/80 dark:bg-black/60 backdrop-blur-md shadow-sm"
                  onClick={() =>
                    setActiveImg((p) =>
                      p === allImages.length - 1 ? 0 : p + 1,
                    )
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Favorite Button */}
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

            {/* Out of Stock Badge */}
            {!inStock && (
              <Badge
                variant="destructive"
                className="absolute top-4 left-4 rounded-full font-normal text-xs"
              >
                Out of Stock
              </Badge>
            )}

            {/* Discount Badge */}
            {hasDiscount && (
              <Badge className="absolute bottom-4 left-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 text-xs px-3">
                Save {discountPercent}%
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
                  className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 transition-all overflow-hidden p-1 bg-stone-50 dark:bg-stone-900 ${
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

        {/* ============================================
            RIGHT: PRODUCT INFO
           ============================================ */}
        <div className="lg:col-span-6 space-y-5">
          {/* Header */}
          <header className="space-y-2">
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-rose-500 uppercase">
              {product.category || "Authentic Beauty"}
            </span>

            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-tight text-foreground leading-tight">
                {product.title}
              </h1>

              {/* Secondary Favorite */}
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

          {/* ============================================
              PRICE CARD — Dynamic based on variant
             ============================================ */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-50 to-white dark:from-stone-900/40 dark:to-stone-900/20 border border-border/40 space-y-3">
            <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
              {hasDiscount ? (
                <>
                  <span className="text-3xl sm:text-4xl font-bold text-rose-600">
                    ৳{displayPrice.toLocaleString()}
                  </span>
                  <span className="text-sm sm:text-base text-muted-foreground line-through">
                    ৳{regularPrice.toLocaleString()}
                  </span>
                  <Badge className="bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 text-[10px]">
                    -{discountPercent}%
                  </Badge>
                </>
              ) : (
                <span className="text-3xl sm:text-4xl font-bold text-foreground">
                  ৳{regularPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.allowCashOnDelivery === false && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl p-3.5 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    Advance Payment Required
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400/90 mt-0.5 leading-relaxed">
                    এই প্রোডাক্টটি ক্যাশ অন ডেলিভারিতে পাওয়া যাবে না। অর্ডার
                    কনফার্ম করতে অনলাইন পেমেন্ট (bKash/Nagad/Card) করতে হবে।
                  </p>
                </div>
              </div>
            )}

            {/* Stock & Brand */}
            <div className="flex items-center gap-4 text-xs flex-wrap pt-2 border-t border-border/40">
              <div className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-rose-500" />
                <span
                  className={inStock ? "text-emerald-600" : "text-rose-600"}
                >
                  {inStock ? `${stockCount} in stock` : "Out of stock"}
                </span>
              </div>
              {product.brand && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{product.brand}</span>
                </div>
              )}
            </div>
          </div>

          {/* ============================================
              VARIANT SELECTOR
             ============================================ */}
          {activeVariants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Choose {activeVariants.length > 1 ? "Options" : "Option"}
                </span>
                {selectedVariant && (
                  <span className="text-[10px] text-muted-foreground font-mono">
                    SKU: {selectedVariant.skuId}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activeVariants.map((v: any, idx: number) => {
                  const isSelected = selectedVariantIdx === idx;
                  const isOutOfStock = v.quantity <= 0;
                  const variantRegular = Number(v.price || 0);
                  const variantSpecial = Number(v.specialPrice || 0);
                  const variantDisplay =
                    variantSpecial > 0 && variantSpecial < variantRegular
                      ? variantSpecial
                      : variantRegular;

                  return (
                    <button
                      key={v.skuId}
                      onClick={() => setSelectedVariantIdx(idx)}
                      disabled={isOutOfStock}
                      className={`relative px-3 py-3 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20 shadow-sm"
                          : "border-border/60 hover:border-rose-200 dark:hover:border-rose-900/40"
                      } ${
                        isOutOfStock
                          ? "opacity-40 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      )}

                      <p
                        className={`text-xs sm:text-sm font-semibold line-clamp-1 ${
                          isSelected ? "text-rose-600" : "text-foreground"
                        }`}
                      >
                        {v.combo || v.skuId}
                      </p>

                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span
                          className={`text-sm font-bold ${
                            isSelected ? "text-rose-600" : "text-foreground"
                          }`}
                        >
                          ৳{variantDisplay.toLocaleString()}
                        </span>
                        {variantSpecial > 0 &&
                          variantSpecial < variantRegular && (
                            <span className="text-[10px] text-muted-foreground line-through">
                              ৳{variantRegular.toLocaleString()}
                            </span>
                          )}
                      </div>

                      {isOutOfStock && (
                        <p className="text-[9px] text-rose-500 mt-0.5">
                          Out of stock
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================
              QUANTITY & ACTIONS
             ============================================ */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-border/60 rounded-xl bg-background h-11">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="px-3 h-full hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium transition-colors text-muted-foreground disabled:opacity-40 rounded-l-xl"
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
                  className="px-3 h-full hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium transition-colors text-muted-foreground disabled:opacity-40 rounded-r-xl"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                variant="outline"
                onClick={() => handleAddToCart(false)}
                disabled={!inStock || isAdding}
                className="flex-1 h-11 border-border/60 rounded-xl text-xs sm:text-sm font-medium gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-300"
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
              <ShareButton
                url={`/alldata/${product.slug || product._id}`}
                title={product.title}
                description={product.shortDescription}
                image={allImages[0]}
                variant="button"
                className="h-11"
              />
            </div>

            {/* Buy Now */}
            <Button
              onClick={() => handleAddToCart(true)}
              disabled={!inStock || isAdding}
              className="w-full h-11 bg-slate-900 dark:bg-rose-600 hover:bg-slate-800 dark:hover:bg-rose-700 text-white font-medium text-xs sm:text-sm rounded-xl gap-2 transition-all"
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

          {/* Trust Badges */}
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

          {/* Highlights */}
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

          {/* Description */}
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
          {/* Reviews Section */}
          <div className="space-y-4 border-t border-border/40 pt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500" />
                Reviews ({reviews.length})
              </h3>
              {avgRating > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="font-bold text-amber-500">
                    {avgRating.toFixed(1)}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= Math.round(avgRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-stone-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Review Form */}
            {isLoggedIn ? (
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 space-y-3">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium mr-2">Your rating:</span>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewRating(s)}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= newRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-stone-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Write your review..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="text-sm resize-none"
                />
                <Button
                  onClick={handleSubmitReview}
                  disabled={isReviewSubmitting || !newComment.trim()}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs"
                >
                  {isReviewSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground bg-stone-50 dark:bg-stone-900/50 p-3 rounded-xl">
                Please{" "}
                <a href="/login" className="text-rose-500 font-medium">
                  login
                </a>{" "}
                to write a review.
              </p>
            )}

            {/* Review List */}
            <div className="space-y-2">
              {reviews.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                reviews.map((r) => (
                  <div
                    key={r._id}
                    className="p-3 border border-border/40 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">
                        {r.userName}
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= r.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-stone-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{r.comment}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
