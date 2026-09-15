// AddProduct.tsx
import ProductAddForm from "./ProductAddForm";

export default function AddProduct() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-rose-50/20 to-purple-50/30 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Add New Product
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create a new beauty or jewelry product for your store
          </p>
        </div>
        <ProductAddForm />
      </div>
    </div>
  );
}