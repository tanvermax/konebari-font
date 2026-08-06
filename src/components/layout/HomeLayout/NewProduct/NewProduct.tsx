import { Button } from "@/components/ui/button";
import { useAllpstockQuery } from "@/redux/features/product/product.api";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import type { IProductCard } from "@/redux/features/product/Product.types";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "../ProductCard/ProductCard";

export default function NewProduct() {
  const { data, isLoading, isError } = useAllpstockQuery(
    { limit: 20, page: 1 },
    { refetchOnMountOrArgChange: true }
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 sm:py-10">
      
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6 sm:mb-8 border-b border-pink-100 dark:border-pink-900/20 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-pink-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles size={13} />
            Fresh In Store
          </div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground">
            NEW PRODUCTS
          </h1>
        </div>
        <Button asChild size="sm" variant="outline" className="rounded-full border-pink-200 dark:border-pink-800/40 text-xs hover:bg-pink-50 dark:hover:bg-pink-900/20">
          <Link to="/shop" className="flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </Button>
      </div>

      {/* Responsive Beauty Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 mb-10">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 sm:h-72 w-full rounded-2xl" />
          ))
        ) : isError ? (
          <div className="col-span-full text-center py-12 bg-pink-50/30 dark:bg-pink-950/10 rounded-2xl border border-pink-100 dark:border-pink-900/20">
            <p className="text-xs sm:text-sm text-muted-foreground">
              প্রোডাক্ট লোড করতে সমস্যা হয়েছে, দয়া করে পেজটি রিফ্রেশ করুন।
            </p>
          </div>
        ) : !data?.data?.length ? (
          <div className="col-span-full text-center py-12 bg-pink-50/30 dark:bg-pink-950/10 rounded-2xl border border-pink-100 dark:border-pink-900/20">
            <p className="text-xs sm:text-sm text-muted-foreground">
              কোনো নতুন প্রোডাক্ট পাওয়া যায়নি।
            </p>
          </div>
        ) : (
          data.data.map((product: IProductCard) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.minPrice ?? 0}
              specialPrice={product.specialPrice}
              hasDiscount={product.hasDiscount}
              inStock={product.inStock}
              image={product.mainImage || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop"}
              slug={product.slug}
            />
          ))
        )}
      </div>

      {/* Bottom Call to Action */}
      <div className="text-center pt-2">
        <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md text-xs sm:text-sm px-8">
          <Link to="/shop">Browse All Beauty Products</Link>
        </Button>
      </div>
    </div>
  );
}