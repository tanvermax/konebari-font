"use client";
import { useState, useMemo } from 'react';

import {
  ChevronLeft,
  ChevronRight, Info, ShoppingBag, ArrowRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from '@/redux/hooks/useCart';
import { toast } from 'sonner';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { usePricestockDetailsQuery } from '@/redux/features/product/product.api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { IProductDetail, IProductVariant } from '@/redux/features/product/Product.types';
import { useNavigate, useParams } from 'react-router';

const ProductDetails = () => {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isLoading: isAddingToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImg, setActiveImg] = useState<number>(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);

  const { data: product, isLoading, refetch } = usePricestockDetailsQuery(id) as {
    data: IProductDetail | undefined;
    isLoading: boolean;
    refetch: () => void;
  };

  const activeVariants = useMemo(
    () => (product?.variants || []).filter(v => v.status === 'active'),
    [product]
  );
  const selectedVariant: IProductVariant | undefined = activeVariants[selectedVariantIdx];

  const allImages = useMemo(() => {
    if (!product) return [];
    const imgs = [
      product.mainImage,
      ...(product.images || []),
      selectedVariant?.image,
      ...(selectedVariant?.images || []),
    ];
    return Array.from(new Set(imgs.filter((img): img is string => Boolean(img))));
  }, [product, selectedVariant]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Card className="w-full max-w-3xl border-border/40">
          <CardHeader><Skeleton className="h-8 w-2/3" /></CardHeader>
          <CardContent><Skeleton className="aspect-video w-full rounded-2xl" /></CardContent>
        </Card>
      </div>
    );
  }

  if (!product) return (
    <div className="p-16 text-center text-muted-foreground font-light text-sm">
      প্রোডাক্টটি পাওয়া যায়নি।
    </div>
  );

  const displayPrice = selectedVariant?.price ?? product.minPrice ?? 0;
  const displaySpecialPrice = selectedVariant?.specialPrice ?? product.specialPrice;
  const hasDiscount = displaySpecialPrice != null;
  const discountPercentage = hasDiscount
    ? Math.round(((displayPrice - (displaySpecialPrice as number)) / displayPrice) * 100)
    : 0;
  const inStock = selectedVariant ? selectedVariant.quantity > 0 : product.inStock;

  const handleAddToCart = async (showToast = true) => {
    try {
      await addToCart({
        userId: userInfo?.data?._id,
        productId: product._id,
        skuId: selectedVariant?.skuId,
        quantity: quantity,
        price: hasDiscount ? displaySpecialPrice : displayPrice,
        title: product.name,
        images: allImages,
      });
      refetch();
      if (showToast) toast.success('Added to cart!');
      return true;
    } catch (error) {
      console.error('addToCart failed:', error);
      toast.error('Failed to add product');
      return false;
    }
  };

  const handleBuyNow = async () => {
    const success = await handleAddToCart(false);
    if (success) {
      navigate('/cart');
    } else {
      toast.error('Could not proceed to checkout');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* GALLERY SECTION */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative group rounded-2xl overflow-hidden border border-border/40 bg-stone-50 dark:bg-stone-900/50 aspect-square">
            <img
              src={allImages[activeImg] || "/placeholder-image.png"}
              alt={product.name}
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
            {allImages.length > 1 && (
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" className="rounded-full h-9 w-9 bg-white/80 dark:bg-black/60 backdrop-blur-md shadow-sm"
                  onClick={() => setActiveImg(prev => prev === 0 ? allImages.length - 1 : prev - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full h-9 w-9 bg-white/80 dark:bg-black/60 backdrop-blur-md shadow-sm"
                  onClick={() => setActiveImg(prev => prev === allImages.length - 1 ? 0 : prev + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            {!inStock && (
              <Badge variant="destructive" className="absolute top-4 left-4 rounded-full font-normal text-xs">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImg(idx)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-xl border transition-all overflow-hidden p-1 bg-stone-50 dark:bg-stone-900 ${
                    activeImg === idx ? 'border-rose-500 ring-1 ring-rose-500' : 'border-border/40 opacity-70 hover:opacity-100'
                  }`}>
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFO SECTION */}
        <div className="lg:col-span-6 space-y-6">
          <header className="space-y-2">
            <span className="text-xs font-semibold tracking-wider text-rose-500 uppercase">
              Authentic Beauty
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-foreground">
              {product.name}
            </h1>
            {product.nameBn && (
              <p className="text-muted-foreground font-light text-base">
                {product.nameBn}
              </p>
            )}
          </header>

          {/* Pricing Card */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-border/40 flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-2xl sm:text-3xl font-semibold text-foreground">৳{displaySpecialPrice}</span>
                  <span className="text-sm font-light text-muted-foreground line-through">৳{displayPrice}</span>
                </>
              ) : (
                <span className="text-2xl sm:text-3xl font-semibold text-foreground">৳{displayPrice}</span>
              )}
            </div>
            {discountPercentage > 0 && (
              <span className="bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs px-3 py-1 rounded-full font-medium border border-rose-200/50 dark:border-rose-900/30">
                Save {discountPercentage}%
              </span>
            )}
          </div>

          {/* VARIANT PICKER */}
          {activeVariants.length > 1 && (
            <div className="space-y-2.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Options</span>
              <div className="flex flex-wrap gap-2">
                {activeVariants.map((v, idx) => (
                  <button
                    key={v.skuId}
                    onClick={() => { setSelectedVariantIdx(idx); setActiveImg(0); }}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      selectedVariantIdx === idx
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                        : 'border-border/60 text-muted-foreground hover:border-border'
                    } ${v.quantity <= 0 ? 'opacity-40 line-through' : ''}`}
                    disabled={v.quantity <= 0}
                  >
                    {v.combo || v.skuId}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border/60 rounded-xl bg-background h-11">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1} className="px-3.5 h-full hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium transition-colors text-muted-foreground">-</button>
                <span className="px-3 font-medium text-sm text-foreground">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3.5 h-full hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium transition-colors text-muted-foreground">+</button>
              </div>

              <Button
                variant="outline"
                onClick={() => handleAddToCart(true)}
                disabled={!inStock || isAddingToCart}
                className="flex-1 h-11 border-border/60 rounded-xl text-xs sm:text-sm font-normal gap-2"
              >
                <ShoppingBag size={15} /> Add to Cart
              </Button>
            </div>

            <Button
              onClick={handleBuyNow}
              disabled={!inStock || isAddingToCart}
              className="w-full h-11 bg-slate-900 dark:bg-rose-600 hover:bg-slate-800 dark:hover:bg-rose-700 text-white font-normal text-xs sm:text-sm rounded-xl gap-2 transition-all shadow-none"
            >
              {inStock ? <>Buy Now <ArrowRight size={15} /></> : 'Out of Stock'}
            </Button>
          </div>

          {/* Highlights & Details */}
          {product.highlights && (
            <div className="space-y-2 border-t border-border/40 pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Info size={14} className="text-rose-500" /> Highlights
              </h3>
              <div className="prose prose-sm max-w-none text-muted-foreground font-light text-xs sm:text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.highlights }} />
            </div>
          )}

          {product.description && (
            <div className="space-y-2 border-t border-border/40 pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</h3>
              <div className="prose prose-sm max-w-none text-muted-foreground font-light text-xs sm:text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;