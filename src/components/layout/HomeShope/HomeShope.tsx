import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

import ProductCard from "../HomeLayout/ProductCard/ProductCard";
import { useAllpstockQuery } from "@/redux/features/product/product.api";
import ProductSearch from "./ProductSearch";
import type { IProductCard } from "@/redux/features/product/Product.types";

// NOTE: these no longer match your real category values (see message below).
// Replace with actual category names from the 'alldata' collection
// (e.g. "Emblems", "GuitarBassAccessories", "CatToys" ...) or fetch them dynamically.
const CATEGORIES = ["All", "Pet Supplies", "Automotive", "Musical Instruments", "Other"];

/* ================== Skeleton Card ================== */
const ProductSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-[160px] w-full rounded-lg" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

export default function HomeShope() {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<IProductCard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* ================== API ================== */
  const { data, isLoading, isFetching } = useAllpstockQuery({
    page,
    limit: 40,
    search: searchTerm,
    category: selectedCategory === "All" ? undefined : selectedCategory,
  });

  useEffect(() => {
    setAllProducts([]);
    setPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    if (data?.data) {
      setAllProducts((prev) => {
        if (page === 1) return data.data;
        const existingIds = new Set(prev.map((p) => p._id));
        const newUniqueProducts = data.data.filter(
          (product: IProductCard) => !existingIds.has(product._id)
        );
        return [...prev, ...newUniqueProducts];
      });
    }
  }, [data, page]);

  /* ================== Frontend Sorting ================== */
  const sortedProducts = [...allProducts].sort((a, b) => {
    const priceA = (a.hasDiscount ? a.specialPrice : a.minPrice) ?? 0;
    const priceB = (b.hasDiscount ? b.specialPrice : b.minPrice) ?? 0;

    if (sortBy === "lowToHigh") return priceA - priceB;
    if (sortBy === "highToLow") return priceB - priceA;
    return 0;
  });

  return (
    <div className="container mx-auto px-4 md:py-10 py-5">
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            className="rounded-full whitespace-nowrap"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* ================== Search + Sort ================== */}
      <div className="flex flex-1 items-center justify-between gap-3 w-full md:mb-10 mb-5">
        <ProductSearch
          onSearch={(val) => {
            setSearchTerm(val);
            setPage(1);
          }}
          initialValue={searchTerm}
        />

        <Select onValueChange={setSortBy}>
          <SelectTrigger className="h-11">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="lowToHigh">Price: Low → High</SelectItem>
            <SelectItem value="highToLow">Price: High → Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ================== Product Grid ================== */}
      <AnimatePresence>
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {isLoading &&
            Array.from({ length: 20 }).map((_, i) => <ProductSkeleton key={i} />)}

          {!isLoading &&
            sortedProducts.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <ProductCard
                  id={product._id}
                  name={product.name}
                  price={product.minPrice ?? 0}
                  specialPrice={product.specialPrice}
                  hasDiscount={product.hasDiscount}
                  inStock={product.inStock}
                  image={product.mainImage || "/placeholder-image.png"}
                  slug={product.slug}
                />
              </motion.div>
            ))}

          {!isLoading && sortedProducts.length === 0 && (
            <p className="col-span-full text-center text-sm text-muted-foreground py-10">
              কোনো প্রোডাক্ট পাওয়া যায়নি।
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ================== Load More ================== */}
      <div className="mt-12 flex justify-center">
        {allProducts.length < (data?.meta?.total || 0) && (
          <Button
            disabled={isFetching}
            onClick={() => setPage((p) => p + 1)}
            className="min-w-[160px]"
          >
            {isFetching ? "Loading more..." : "Load More"}
          </Button>
        )}
      </div>
    </div>
  );
}