/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useCart } from '@/redux/hooks/useCart';
import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router'; 
import { toast } from 'sonner';
import { ShoppingCart, Eye, Zap } from 'lucide-react';

interface productCardPropsa {
    id: string;
    name: string;
    price: number;
    SpecialPrice: number;
    image: string;
    isLoading?: boolean;
}

export const useTextTruncate = (maxLines: number = 2) => {
    const textRef = useRef<HTMLParagraphElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        if (textRef.current) {
            const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
            const maxHeight = lineHeight * maxLines;
            const actualHeight = textRef.current.scrollHeight;
            setIsTruncated(actualHeight > maxHeight);
        }
    }, [maxLines]);

    return { textRef, isTruncated, showMore, setShowMore };
};

export default function ProductCard({ id, name, price, SpecialPrice, image, isLoading }: productCardPropsa) {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { textRef, showMore } = useTextTruncate(2);
    const { data: userInfo } = useUserInfoQuery(undefined);

    const finalPrice = price || SpecialPrice;
    
    const processAddToCart = async () => {
        return await addToCart({
            productId: id,
            quantity: 1,
            userId: userInfo?.data?._id,
            price: finalPrice,
            title: name,
            images: image
        });
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await processAddToCart();
            toast.success('Added to cart!');
        } catch (error) {
            toast.error('Could not add to cart');
        }
    };

    const handleBuyNow = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await processAddToCart();
            navigate('/cart'); 
        } catch (error) {
            toast.error('Failed to process order');
        }
    };

    const discouunt = Math.round(SpecialPrice - price);
    const discountPercentage = SpecialPrice > 0 ? Math.round(((discouunt / SpecialPrice) * 100)) : 0;

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 p-4 border rounded-xl bg-card shadow-sm">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        );
    }

    return (
        <div className="group relative bg-card hover:shadow-2xl transition-all duration-500 border rounded-xl overflow-hidden flex flex-col h-full">
            <Link to={`/pricestocks/${id}`} className="relative block aspect-square overflow-hidden bg-muted">
                <img
                    src={image}
                    alt={`${name} - JCS Trading Bangladesh`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {price > 0 && discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-2 py-1 shadow-lg italic font-black">
                            {discountPercentage}% OFF
                        </Badge>
                    </div>
                )}

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                   <div className="bg-white/90 p-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-5 h-5 text-primary" />
                   </div>
                </div>
            </Link>

            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-3">
                    <Link to={`/pricestocks/${id}`}>
                        <h2
                            ref={textRef}
                            className={`text-xs md:text-sm font-semibold    leading-tight hover:text-primary transition-colors ${
                                !showMore ? 'line-clamp-2' : ''
                            }`}
                        >
                            {name}
                        </h2>
                    </Link>
                </div>

                <div className="mt-auto mb-4">
                    {price > 0 ? (
                        <div className="flex items-baseline gap-2">
                            <span className="text-md font-black text-red-600 ">
                                ৳{price.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground line-through opacity-70">
                                ৳{SpecialPrice?.toLocaleString()}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xl font-black text-foreground italic">
                            ৳{SpecialPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        onClick={handleBuyNow}
                        size="sm"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-black uppercase italic tracking-widest shadow-lg transition-all active:scale-95"
                    >
                        <Zap className="w-4 h-4 mr-2 fill-current" />
                        Buy Now
                    </Button>
                    <Button
                        onClick={handleAddToCart}
                        variant="outline"
                        size="sm"
                        className="w-full rounded-lg font-bold uppercase tracking-tighter border-primary/30 text-primary hover:bg-primary/5"
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        + Cart
                    </Button>
                </div>
            </div>
        </div>
    );
}