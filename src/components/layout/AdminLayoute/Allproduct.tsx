/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAllproductQuery, useDeleteProductMutation } from "@/redux/features/product/product.api"
import {
  Dialog,
  // DialogClose,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  // DialogHeader,
  // DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import ProductAddForm from "./AddProduct/ProductAddForm"
import AdminProductCard from "../HomeLayout/ProductCard/AdminProductCard";
import { useState } from "react";
import { toast } from "sonner";
// import ProductCard from "../HomeLayout/ProductCard/ProductCard";
export default function Allproduct() {

  const { data, isLoading, error,refetch } = useAllproductQuery(undefined);
  const [deleteProduct] = useDeleteProductMutation();
  const [deletingProducts, setDeletingProducts] = useState<Set<string>>(new Set());
  // console.log("data")
  console.log(data)

  const handleDeleteProduct = async (productId: string) => {
    // if (!window.confirm("Are you sure you want to delete this product?")) return;

    setDeletingProducts(prev => new Set(prev).add(productId));

    try {
      await deleteProduct(productId).unwrap();

      toast.success("Product deleted successfully");
      refetch()
    } catch (error) {
      console.error("Failed to delete product:", error);
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
    <>
      <div className="">
        <div className="flex justify-end mb-4">
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button className="bg-primary" variant="outline">Add product</Button>
              </DialogTrigger>
              <DialogContent className="overflow-y-auto max-h-[80vh] w-full sm:w-3/4 lg:w-2/4">
                <ProductAddForm />

              </DialogContent>
            </form>
          </Dialog>
        </div>
        <div className="grid md:grid-cols-3 gap-4">

          {data?.map((invoice: { title: string, _id: string, description: string, slug: string, price: string, images: string }) => (

            <AdminProductCard
            // <ProductCard
              id={invoice._id}
              description={invoice.description}
              key={invoice._id}
              name={invoice.title}
              price={parseFloat(invoice.price)}
              images={invoice.images}
              onDelete={handleDeleteProduct}
              isLoading={isLoading}
              isDeleting={deletingProducts.has(invoice._id)} />

          ))}
          {error && <div>Error loading products</div>}

        </div>
      </div>
    </>
  )
}