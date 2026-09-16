// components/layout/HomeShope/HomeShope.tsx
import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, PackageX, Loader2, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import ProductCard from "../HomeLayout/ProductCard/ProductCard";
import {
  useAllpstockQuery,
  useCategoriesQuery,
} from "@/redux/features/product/product.api";
import ProductSearch from "./ProductSearch";
import type { IProductCard } from "@/redux/features/product/Product.types";
import CategoryPills from "./CategoryPills";

/* ================== Skeleton ================== */
const ProductSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="aspect-square w-full rounded-2xl" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-9 w-full rounded-xl" />
  </div>
);

const PAGE_SIZE = 40;

export default function HomeShope() {
  // ✅ URL params
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") || "All";
  const urlBrand = searchParams.get("brand") || "";        // 👈 NEW
  const urlSearch = searchParams.get("search") || "";

  // ================== STATE ==================
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<IProductCard[]>([]);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [sortBy, setSortBy] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedBrand, setSelectedBrand] = useState(urlBrand);   // 👈 NEW
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // ✅ Sync state with URL
  useEffect(() => {
    if (selectedCategory !== urlCategory) {
      setSelectedCategory(urlCategory);
      setPage(1);
      setAllProducts([]);
    }
    if (selectedBrand !== urlBrand) {          // 👈 NEW
      setSelectedBrand(urlBrand);
      setPage(1);
      setAllProducts([]);
    }
    if (searchTerm !== urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [urlCategory, urlBrand, urlSearch]);

  // ================== CATEGORIES ==================
  const { data: categoriesData } = useCategoriesQuery(undefined);

  const categories = useMemo(() => {
    const list = Array.isArray(categoriesData) ? categoriesData : [];
    return list.filter((c: any) => c && (c.name || c._id || c.title));
  }, [categoriesData]);

  // ✅ Update URL when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    setAllProducts([]);

    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    setSearchParams(params, { replace: true });
  };

  // ✅ Update URL when search changes
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setPage(1);
    setAllProducts([]);

    const params = new URLSearchParams(searchParams);
    if (!term) {
      params.delete("search");
    } else {
      params.set("search", term);
    }
    setSearchParams(params, { replace: true });
  };

  // ✅ Remove brand filter                  // 👈 NEW
  const handleRemoveBrand = () => {
    setSelectedBrand("");
    setPage(1);
    setAllProducts([]);

    const params = new URLSearchParams(searchParams);
    params.delete("brand");
    setSearchParams(params, { replace: true });
  };

  // ================== QUERY PARAMS ==================
  const sortParam = useMemo(() => {
    if (sortBy === "lowToHigh") return "price";
    if (sortBy === "highToLow") return "-price";
    return "-createdAt";
  }, [sortBy]);

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: searchTerm || undefined,
      category: selectedCategory === "All" ? undefined : selectedCategory,
      brand: selectedBrand ? selectedBrand : undefined,   // 👈 NEW
      sort: sortParam,
      status: "all",
    }),
    [page, searchTerm, selectedCategory, selectedBrand, sortParam]
  );

  // ================== API ==================
  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useAllpstockQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  // ================== RESET ON FILTER CHANGE ==================
  useEffect(() => {
    setAllProducts([]);
    setPage(1);
  }, [searchTerm, selectedCategory, selectedBrand, sortBy]);   // 👈 selectedBrand যোগ

  // ================== ACCUMULATE DATA ==================
  useEffect(() => {
    if (data?.data) {
      setAllProducts((prev) => {
        if (page === 1) return data.data;

        const existingIds = new Set(prev.map((p) => p._id));
        const newUnique = data.data.filter(
          (p: IProductCard) => !existingIds.has(p._id)
        );
        return [...prev, ...newUnique];
      });
    }
  }, [data, page]);

  const totalProducts = data?.meta?.total || 0;
  const hasMore = allProducts.length < totalProducts;

  // ================== INFINITE SCROLL ==================
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  const isInitialLoading = isLoading && allProducts.length === 0;

  // ✅ Check if any filter active
  const hasActiveFilters =
    searchTerm || selectedCategory !== "All" || selectedBrand;

  // ✅ Reset all filters
  const handleResetAll = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedBrand("");
    setSearchParams({}, { replace: true });
    refetch();
  };

  return (
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
          Shop Collection
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          {totalProducts > 0
            ? `Discover ${totalProducts}+ authentic beauty products`
            : "Explore our collection"}
        </p>
      </div>

      {/* ✅ Categories (URL-synced) */}
      <CategoryPills
        categories={categories}
        selected={selectedCategory}
        onSelect={handleCategoryChange}
      />

      {/* ✅ Brand Filter Banner (only shows when brand is selected) */}
      {selectedBrand && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-4 flex items-center justify-between gap-3 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border border-rose-200/60 dark:border-rose-900/40 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {selectedBrand.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">
                Brand Filter
              </p>
              <p className="text-sm font-semibold text-foreground">
                {selectedBrand}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveBrand}
            className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/40 gap-1.5 px-3 rounded-xl"
          >
            <X className="w-3.5 h-3.5" />
            Remove
          </Button>
        </motion.div>
      )}

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full mb-6">
        <ProductSearch
          onSearch={handleSearchChange}
          initialValue={searchTerm}
        />

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-11 w-full sm:w-[200px]">
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

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="text-xs gap-1">
              Search: "{searchTerm}"
            </Badge>
          )}
          {selectedCategory !== "All" && (
            <Badge variant="secondary" className="text-xs gap-1">
              Category: {selectedCategory}
            </Badge>
          )}
          {selectedBrand && (
            <Badge
              variant="secondary"
              className="text-xs gap-1 bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300"
            >
              Brand: {selectedBrand}
              <button
                onClick={handleRemoveBrand}
                className="ml-1 hover:bg-rose-200 dark:hover:bg-rose-900/60 rounded-full p-0.5"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            className="h-6 text-xs text-rose-500 hover:text-rose-600 gap-1 px-2"
          >
            <RefreshCw className="w-3 h-3" />
            Reset All
          </Button>
        </div>
      )}

      {/* Results Count */}
      {!isInitialLoading && allProducts.length > 0 && (
        <p className="text-xs text-muted-foreground mb-3">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {allProducts.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">{totalProducts}</span>{" "}
          products
          {selectedBrand && (
            <>
              {" "}
              from{" "}
              <span className="font-semibold text-rose-600">
                {selectedBrand}
              </span>
            </>
          )}
        </p>
      )}

      {/* Product Grid */}
      {isInitialLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : allProducts.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center mb-5">
            <PackageX className="w-12 h-12 text-rose-500" />
          </div>
          <h2 className="text-lg md:text-xl font-bold mb-2">
            No Products Found
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            {searchTerm
              ? `No products matched "${searchTerm}". Try another keyword.`
              : selectedBrand
              ? `No products available for "${selectedBrand}" brand.`
              : "No products available in this category."}
          </p>
          <Button
            onClick={handleResetAll}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
        >
          <AnimatePresence mode="popLayout">
            {allProducts.map((product, idx) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.5) }}
              >
                <ProductCard
                  id={product._id}
                  name={product.name}
                  price={product.minPrice ?? 0}
                  specialPrice={product.specialPrice}
                  hasDiscount={product.hasDiscount}
                  inStock={product.inStock}
                  image={product.mainImage || "/placeholder.png"}
                  slug={product.slug}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Load More */}
      {allProducts.length > 0 && (
        <div ref={loadMoreRef} className="mt-12 flex justify-center">
          {hasMore ? (
            <Button
              disabled={isFetching}
              onClick={() => setPage((p) => p + 1)}
              className="min-w-[180px] rounded-xl gap-2"
              variant="outline"
            >
              {isFetching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>Load More ({totalProducts - allProducts.length} left)</>
              )}
            </Button>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground">
                ✨ You've viewed all {totalProducts} products
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}