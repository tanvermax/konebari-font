import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import { Heart } from "lucide-react";

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
    const displayPrice = hasDiscount && specialPrice != null ? specialPrice : price;

    const discount = hasDiscount && specialPrice
        ? Math.round(((price - specialPrice) / price) * 100)
        : 0;

    return (
        <Link to={`/alldata/${id || slug}`} className="block group">
            <Card className="overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:shadow-md hover:border-border/80">

                {/* Image Area */}
                <div className="relative aspect-square overflow-hidden bg-stone-100 dark:bg-stone-900">
                    <img
                        src={image}
                        alt={name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Discount Badge */}
                    {hasDiscount && (
                        <span className="absolute left-3 top-3 rounded-full bg-rose-500/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-medium text-white shadow-sm">
                            -{discount}%
                        </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                        aria-label="Add to wishlist"
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-sm transition-all hover:bg-white hover:scale-110"
                        onClick={(e) => e.preventDefault()}
                    >
                        <Heart
                            size={15}
                            className="text-stone-600 dark:text-stone-300 transition hover:fill-rose-500 hover:text-rose-500"
                        />
                    </button>

                    {/* Out of Stock Overlay */}
                    {!inStock && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                            <Badge variant="outline" className="bg-background/90 text-xs font-normal">
                                Sold Out
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Info Content */}
                <div className="p-4 space-y-2">
                    <h3 className="line-clamp-2 text-xs sm:text-sm font-medium text-foreground/90 transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400 min-h-[36px] sm:min-h-[40px] leading-snug">
                        {name}
                    </h3>

                    <div className="flex items-baseline justify-between pt-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm sm:text-base font-semibold text-foreground">
                                ৳{displayPrice.toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <span className="text-xs text-muted-foreground line-through font-light">
                                    ৳{price.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {inStock && (
                            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-900/30">
                                In Stock
                            </span>
                        )}
                    </div>
                </div>

            </Card>
        </Link>
    );
}