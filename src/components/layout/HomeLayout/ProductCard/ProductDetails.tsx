"use client";
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
 ChevronLeft,
  ChevronRight, Info, Zap, ShoppingCart
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from '@/redux/hooks/useCart';
import { toast } from 'sonner';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { usePricestockDetailsQuery } from '@/redux/features/product/product.api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  _id: string;
  "Product ID": number;
  "*Product Name(English)": string;
  "Product Name(Bengali) look function": string;
  "Shop SKU": string;
  "*Quantity": number;
  "*Price": number;
  "SpecialPrice": number;
  Highlights: string;
  images: string;
  description: string;
  "White Background Image"?: string;
  images2?: string;
  images3?: string;
  images4?: string;
  images5?: string;
  image6?: string;
}

const ProductDetails = () => {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isLoading: isAddingToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImg, setActiveImg] = useState<number>(0);

  const { data: apiResponse, isLoading, refetch } = usePricestockDetailsQuery(id);
  const product = apiResponse?.data?.[0] as Product;
console.log(isAddingToCart);
  const allImages = product ? Array.from(new Set([
    product.images,
    product["White Background Image"],
    product.images2,
    product.images3,
    product.images4,
    product.images5,
    product.image6
  ])).filter((img): img is string => Boolean(img)) : [];

  if (isLoading) {
    return (
      <div className="container mx-auto p-10 flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader><Skeleton className="h-8 w-2/3" /></CardHeader>
          <CardContent><Skeleton className="aspect-video w-full" /></CardContent>
        </Card>
      </div>
    );
  }

  if (!product) return <div className="p-10 text-center text-red-500 font-bold">Product not found</div>;

  const handleAddToCart = async (showToast = true) => {
    try {
      await addToCart({
        userId: userInfo?.data?._id,
        productId: product._id,
        quantity: quantity,
        price: product["SpecialPrice"] || product["*Price"],
        title: product["*Product Name(English)"],
        images: product.images
      });
      refetch();
      if (showToast) toast.success('Added to cart!');
      return true;
    } catch (error) {
      toast.error('Failed to add product');
      return false;
    }
  };

  const handleBuyNow = async () => {
    const success = await handleAddToCart(false);
    if (success) navigate('/cart');
  };

  const discountPercentage = product["SpecialPrice"]
    ? Math.round(((product["*Price"] - product["SpecialPrice"]) / product["*Price"]) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* GALLERY SECTION */}
        <div className="space-y-6">
          <div className="relative group rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-white">
            <img
              src={allImages[activeImg]}
              alt={product["*Product Name(English)"]}
              className="w-full aspect-square object-contain transition-transform duration-700 group-hover:scale-105"
            />
            {allImages.length > 1 && (
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" className="rounded-full h-12 w-12 shadow-xl"
                  onClick={() => setActiveImg(prev => prev === 0 ? allImages.length - 1 : prev - 1)}>
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full h-12 w-12 shadow-xl"
                  onClick={() => setActiveImg(prev => prev === allImages.length - 1 ? 0 : prev + 1)}>
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {allImages.map((img, idx) => (
              <button key={idx} onClick={() => setActiveImg(idx)}
                className={`relative flex-shrink-0 w-24 h-24 rounded-2xl border-4 transition-all overflow-hidden ${
                  activeImg === idx ? 'border-orange-500 scale-105' : 'border-transparent opacity-60'
                }`}>
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT INFO SECTION */}
        <div className="flex flex-col space-y-8">
          <header className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-none font-bold italic px-4">JCS EXCLUSIVE</Badge>
            <h1 className="text-xl md:text-xl      font-semibold">
              {product["*Product Name(English)"]}
            </h1>
            <p className="text-muted-foreground font-medium text-lg ">
              {product["Product Name(Bengali) look function"]}
            </p>
          </header>

          <div className="bg-secondary/30 p-8 rounded-[2rem] border-2 border-orange-100 flex items-center justify-between">
            <div className="flex flex-col">
              {product["SpecialPrice"] ? (
                <>
                  <span className="text-sm font-bold text-muted-foreground line-through italic">৳ {product["*Price"]}</span>
                  <span className="text-5xl font-black text-orange-600 italic tracking-tighter">৳ {product["SpecialPrice"]}</span>
                </>
              ) : (
                <span className="text-5xl font-black text-orange-600 italic tracking-tighter">৳ {product["*Price"]}</span>
              )}
            </div>
            {discountPercentage > 0 && (
              <div className="bg-red-600 text-white px-6 py-2 rounded-full font-black italic animate-pulse shadow-lg">
                -{discountPercentage}%
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border-2 border-muted rounded-2xl bg-background h-16">
              <button onClick={() => setQuantity(q => q - 1)} disabled={quantity <= 1} className="px-6 h-full hover:bg-muted transition-colors">-</button>
              <span className="px-6 font-black text-2xl">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-6 h-full hover:bg-muted transition-colors">+</button>
            </div>

            <Button onClick={handleBuyNow} className="flex-[2] h-16 bg-orange-500 hover:bg-orange-600 text-white font-black text-2xl rounded-2xl uppercase italic tracking-widest shadow-xl transition-all active:scale-95">
              <Zap className="mr-2 fill-current" /> Buy Now
            </Button>
            
            <Button variant="outline" onClick={() => handleAddToCart(true)} className="flex-1 h-16 border-2 border-primary text-primary font-bold rounded-2xl">
              <ShoppingCart className="mr-2" /> + Cart
            </Button>
          </div>

          <div className="space-y-4 border-t pt-8">
            <h3 className="font-black uppercase italic text-sm tracking-widest flex items-center gap-2">
              <Info className="text-orange-500" /> Specifications
            </h3>
            <div className="prose prose-sm max-w-none text-muted-foreground italic font-medium"
              dangerouslySetInnerHTML={{ __html: product.Highlights }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;