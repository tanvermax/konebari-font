/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAllproductQuery, useDeleteProductMutation, useAllpstockQuery } from "@/redux/features/product/product.api"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Import Tabs
import AdminProductCard from "../HomeLayout/ProductCard/AdminProductCard";
import ProductCard from '../HomeLayout/ProductCard/ProductCard'; // Import standard ProductCard
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Allproduct() {
  // 1. Data for Admin Management Tab
  const { data: adminData, isLoading: isAdminLoading, error: adminError, refetch } = useAllproductQuery(undefined);
  
  // 2. Data for Price/Stock Tab
  const { data: stockData, isLoading: isStockLoading } = useAllpstockQuery({ limit: 1000, page: 1 });

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

  return (
    <div className="container mx-auto p-4">
      {/* Header with Add Product */}
      

      {/* Tabs System */}
      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="manage">Manage Products</TabsTrigger>
          <TabsTrigger value="stock">Price & Stock View</TabsTrigger>
        </TabsList>

        {/* Tab 1: Admin Management Section */}
        <TabsContent value="manage">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isAdminLoading ? (
               Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
              ))
            ) : (
              adminData?.map((product: any) => (
                <AdminProductCard
                  id={product._id}
                  description={product.description}
                  key={product._id}
                  name={product.title}
                  price={parseFloat(product.price)}
                  images={product.images}
                  onDelete={handleDeleteProduct}
                  isDeleting={deletingProducts.has(product._id)} 
                />
              ))
            )}
            {adminError && <div className="text-red-500">Error loading admin products</div>}
          </div>
        </TabsContent>

        {/* Tab 2: Stock View Section */}
        <TabsContent value="stock">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {isStockLoading ? (
               Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="w-full">
                    <CardHeader><Skeleton className="h-4 w-2/3" /></CardHeader>
                    <CardContent><Skeleton className="aspect-square w-full" /></CardContent>
                </Card>
               ))
            ) : (
              stockData?.data.map((product: any) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  SpecialPrice={parseFloat(product["*Price"]) || 0}
                  name={product["*Product Name(English)"]}
                  price={parseFloat(product["SpecialPrice"]) || 0}
                  image={product.images || "https://via.placeholder.com/300"}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}