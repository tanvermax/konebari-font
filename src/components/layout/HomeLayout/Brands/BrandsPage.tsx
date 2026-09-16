// components/layout/Brands/BrandsPage.tsx
"use client";
import { useState, useMemo } from "react";
import { Search, Sparkles, Store, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useBrandsQuery } from "@/redux/features/product/product.api";
import BrandCard from "./BrandCard";

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "count">("count");

  const { data: brandsData, isLoading, isError, refetch } = useBrandsQuery(undefined);

  // ✅ Normalize brands
  const brands = useMemo(() => {
    const list = Array.isArray(brandsData) ? brandsData : [];
    return list.filter((b: any) => b && (b.name || b._id || b.title));
  }, [brandsData]);

  // ✅ Filter + Sort
  const filteredBrands = useMemo(() => {
    let result = [...brands];

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((b: any) => {
        const name = (b.name || b._id || b.title || "").toLowerCase();
        return name.includes(q);
      });
    }

    // Sort
    result.sort((a: any, b: any) => {
      const aName = a.name || "";
      const bName = b.name || "";

      if (sortBy === "name") return aName.localeCompare(bName);
      // count sort
      return (b.count || 0) - (a.count || 0);
    });

    return result;
  }, [brands, searchTerm, sortBy]);

  const totalBrands = brands.length;

  // ─────────────────────────────────────────────
  // Loading
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full max-w-md" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
          <Store className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">Failed to Load Brands</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Something went wrong. Please try again.
        </p>
        <Button
          onClick={() => refetch()}
          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">

      {/* ✅ Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500/10 to-pink-500/10">
            <Store className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              Our Brands
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {totalBrands > 0
                ? `Discover ${totalBrands}+ trusted brands`
                : "Browse all brands"}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Search + Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 border-pink-200/50"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={sortBy === "count" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("count")}
            className={`h-11 rounded-xl px-4 text-xs ${
              sortBy === "count"
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0"
                : ""
            }`}
          >
            Popular
          </Button>
          <Button
            variant={sortBy === "name" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("name")}
            className={`h-11 rounded-xl px-4 text-xs ${
              sortBy === "name"
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0"
                : ""
            }`}
          >
            A-Z
          </Button>
        </div>
      </div>

      {/* ✅ Active filter */}
      {searchTerm && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground">Search:</span>
          <Badge variant="secondary" className="text-xs">
            "{searchTerm}"
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm("")}
            className="h-6 text-xs text-rose-500 hover:text-rose-600 gap-1 px-2"
          >
            Clear
          </Button>
        </div>
      )}

      {/* ✅ Result count */}
      {filteredBrands.length > 0 && (
        <p className="text-xs text-muted-foreground mb-4">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filteredBrands.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">{totalBrands}</span>{" "}
          brands
        </p>
      )}

      {/* ✅ Brand Grid */}
      {filteredBrands.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center mb-5">
            <Store className="w-12 h-12 text-rose-500" />
          </div>
          <h2 className="text-lg font-bold mb-2">No Brands Found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {searchTerm
              ? `No brands matched "${searchTerm}".`
              : "No brands available yet."}
          </p>
          {searchTerm && (
            <Button
              onClick={() => setSearchTerm("")}
              variant="outline"
              className="rounded-xl border-rose-200 hover:bg-rose-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {filteredBrands.map((brand: any, idx: number) => (
            <BrandCard key={brand.name || idx} brand={brand} />
          ))}
        </div>
      )}

      {/* ✅ Info banner */}
      {filteredBrands.length > 0 && (
        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/60 dark:border-rose-900/30 rounded-xl px-4 py-3 max-w-xl mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
          <span>
            Click on any brand to explore their full product collection.
          </span>
        </div>
      )}
    </div>
  );
}