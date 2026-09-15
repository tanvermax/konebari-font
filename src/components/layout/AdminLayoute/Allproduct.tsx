import { useState } from "react";
import { useDeleteProductMutation, useAllpstockQuery } from "@/redux/features/product/product.api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AdminProductCard from "../HomeLayout/ProductCard/AdminProductCard";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { IProductCard } from "@/redux/features/product/Product.types";
import { Plus, Package, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";

const PAGE_SIZE = 20;

export default function Allproduct() {
  const navigate = useNavigate();
  const [adminPage, setAdminPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  // Query with filters
  const { 
    data: adminData, 
    isLoading: isAdminLoading, 
    error: adminError, 
    refetch 
  } = useAllpstockQuery({ 
    limit: PAGE_SIZE, 
    page: adminPage, 
    status: activeTab === "all" ? "all" : activeTab === "active" ? "active" : "inactive"
  });
// console.log(adminData.data);
  const [deleteProduct] = useDeleteProductMutation();
  const [deletingProducts, setDeletingProducts] = useState<Set<string>>(new Set());

  const handleDeleteProduct = async (productId: string) => {
    setDeletingProducts(prev => new Set(prev).add(productId));
    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product");
    } finally {
      setDeletingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleAddProduct = () => {
    navigate("/admin/products/add");
  };

  const adminTotalPages = adminData?.meta?.totalPage || adminData?.meta?.totalPages || 1;
  const products = adminData?.data || [];
  const totalProducts = adminData?.meta?.total || 0;

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Products
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your beauty and jewelry products
          </p>
        </div>
        <Button 
          onClick={handleAddProduct}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/25 rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="all" className="text-sm">
            All ({totalProducts})
          </TabsTrigger>
          <TabsTrigger value="active" className="text-sm">
            Active
          </TabsTrigger>
          <TabsTrigger value="inactive" className="text-sm">
            Inactive
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-xl p-4 border border-pink-100/50">
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold text-pink-600">{totalProducts}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-4 border border-green-100/50">
              <p className="text-sm text-muted-foreground">In Stock</p>
              <p className="text-2xl font-bold text-green-600">
                {products.filter((p: IProductCard) => p.inStock).length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-xl p-4 border border-purple-100/50">
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(products.map((p: IProductCard) => p.category)).size}
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-4 border border-amber-100/50">
              <p className="text-sm text-muted-foreground">On Discount</p>
              <p className="text-2xl font-bold text-amber-600">
                {products.filter((p: IProductCard) => p.hasDiscount).length}
              </p>
            </div>
          </div>

          {/* Products Grid */}
          {isAdminLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[350px] w-full rounded-2xl" />
              ))}
            </div>
          ) : adminError ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-red-500 mb-2">Error Loading Products</h3>
              <p className="text-muted-foreground text-sm">Please try refreshing the page</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                No Products Found
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {activeTab === "all" 
                  ? "Start adding products to your store" 
                  : `No ${activeTab} products found`}
              </p>
              {activeTab === "all" && (
                <Button 
                  onClick={handleAddProduct}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: IProductCard & { 
                totalStock?: number; 
                price?: number; 
                minPrice?: number;
                maxPrice?: number;
                variantCount?: number;
                description?: string;
                nameBn?: string;
                category?: string;
              }) => (
                <AdminProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  nameBn={product.nameBn}
                  price={product.price || product.minPrice || 0}
                  minPrice={product.minPrice}
                  maxPrice={product.maxPrice}
                  specialPrice={product.specialPrice}
                  hasDiscount={product.hasDiscount}
                  inStock={product.inStock}
                  quantity={product.totalStock || 0}
                  category={product.category}
                  image={product.mainImage || "https://via.placeholder.com/300x300?text=No+Image"}
                  description={product.description}
                  variantCount={product.variantCount}
                  status={product.status}
                  onDelete={handleDeleteProduct}
                  isDeleting={deletingProducts.has(product._id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isAdminLoading && !adminError && adminTotalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button 
                variant="outline" 
                disabled={adminPage <= 1} 
                onClick={() => setAdminPage(p => p - 1)}
                className="rounded-xl"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {adminPage} of {adminTotalPages} ({totalProducts} total)
              </span>
              <Button 
                variant="outline" 
                disabled={adminPage >= adminTotalPages} 
                onClick={() => setAdminPage(p => p + 1)}
                className="rounded-xl"
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}