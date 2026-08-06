import { useState } from "react";
import { useDeleteProductMutation, useAllpstockQuery } from "@/redux/features/product/product.api"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import AdminProductCard from "../HomeLayout/ProductCard/AdminProductCard";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { IProductCard } from "@/redux/features/product/Product.types";

const PAGE_SIZE = 40; // matches backend MAX_LIMIT ceiling, keeps requests fast

export default function Allproduct() {
  const [adminPage, setAdminPage] = useState(1);

  // 1. Data for Admin Management Tab — status: "all" so inactive/out-of-stock
  // products show up too (public storefront never sends this).
  const { data: adminData, isLoading: isAdminLoading, error: adminError, refetch } =
    useAllpstockQuery({ limit: PAGE_SIZE, page: adminPage, status: "all" });

  const [deleteProduct] = useDeleteProductMutation();
  const [deletingProducts, setDeletingProducts] = useState<Set<string>>(new Set());

  const handleDeleteProduct = async (productId: string) => {
    setDeletingProducts(prev => new Set(prev).add(productId));
    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeletingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const adminTotalPages = adminData?.meta?.totalPages || 1;

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="manage">Manage Products</TabsTrigger>
        </TabsList>

        {/* Tab 1: Admin Management Section */}
        <TabsContent value="manage">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isAdminLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
              ))
            ) : (
              adminData?.data?.map((product: IProductCard & { totalStock?: number }) => (
                <AdminProductCard

                  id={product._id}
                  key={product._id}
                  name={product.name}
                  price={product.minPrice ?? 0}
                  specialPrice={product.specialPrice}
                  hasDiscount={product.hasDiscount}
                  image={product.mainImage || "https://via.placeholder.com/300"}
                  inStock={product.inStock}
                  quantity={product.totalStock}
                  category={product.category}
                  onDelete={handleDeleteProduct}
                  isDeleting={deletingProducts.has(product._id)}
                />
              ))
            )}
            {adminError && <div className="text-red-500 col-span-full">Error loading admin products</div>}
            {!isAdminLoading && !adminError && adminData?.data?.length === 0 && (
              <div className="text-muted-foreground col-span-full text-center">কোনো প্রোডাক্ট নেই</div>
            )}
          </div>

          {/* Pagination */}
          {adminTotalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button variant="outline" disabled={adminPage <= 1} onClick={() => setAdminPage(p => p - 1)}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {adminPage} of {adminTotalPages} ({adminData?.meta?.total} total)
              </span>
              <Button variant="outline" disabled={adminPage >= adminTotalPages} onClick={() => setAdminPage(p => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Stock View Section */}
       
      </Tabs>
    </div>
  )
}