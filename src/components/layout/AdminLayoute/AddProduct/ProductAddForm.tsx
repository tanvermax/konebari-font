/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useCreateProductMutation } from "@/redux/features/product/product.api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SingleImageUploader from "./SingleImageUploader";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

// 🌟 alldata কালেকশনের রিয়েল ফিল্ড অনুযায়ী ইন্টারফেস
interface IAlldataProduct {
  _id: string; // Product ID
  catId: string;
  name: string;
  nameBn: string;
  description: string;
  highlights: string;
  brand: string;
  
  // Variants & Pricing Fields
  skuId: string;
  shopSku: string;
  sellerSku: string;
  quantity: number;
  price: number;
  specialPrice: number;
}

export default function ProductAddForm() {
  const [addProduct] = useCreateProductMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ইমেজের জন্য স্টেটস
  const [mainImage, setMainImage] = useState<File | null>(null);

  const form = useForm<IAlldataProduct>({
    defaultValues: {
      _id: "",
      catId: "",
      name: "",
      nameBn: "",
      description: "",
      highlights: "",
      brand: "No Brand",
      skuId: "",
      shopSku: "",
      sellerSku: "",
      quantity: 1,
      price: undefined,
      specialPrice: undefined,
    },
  });

  const onSubmit = async (data: IAlldataProduct) => {
    if (!mainImage) {
      toast.error("Please upload the Product Image");
      return;
    }

    setIsSubmitting(true);
    
    const makeRequest = async () => {
      const formData = new FormData();
      
      // 🌟 কালেকশনের রিয়েল স্কিমা অনুযায়ী অবজেক্ট স্ট্রাকচার তৈরি
      const finalPayload = {
        _id: data._id,
        catId: data.catId,
        name: data.name,
        nameBn: data.nameBn || data.name, // বাংলা না দিলে ইংলিশটাই সেট হবে
        warranty: null,
        warrantyType: null,
        description: data.description,
        highlights: data.highlights,
        specs: {
          "*Brand": data.brand || "No Brand"
        },
        variants: [
          {
            skuId: data.skuId || `sku_${Date.now()}`,
            shopSku: data.shopSku || `${data._id}_BD-${Date.now()}`,
            sellerSku: data.sellerSku || `${data._id}-${Date.now()}-0`,
            status: "active",
            combo: null,
            quantity: Number(data.quantity),
            price: Number(data.price),
            specialPrice: Number(data.specialPrice || data.price),
            specialPriceStart: new Date().toISOString().slice(0, 19).replace('T', ' '),
            specialPriceEnd: "2030-12-31 23:59:59",
            image: null,
            images: [],
            weightKg: 0.1,
            dims: { l: 20, w: 20, h: 5 },
            dangerousGoods: null
          }
        ],
        minPrice: Number(data.price),
        maxPrice: Number(data.price),
        specialPrice: Number(data.specialPrice || data.price),
        hasDiscount: Number(data.specialPrice) < Number(data.price),
        totalStock: Number(data.quantity),
        inStock: Number(data.quantity) > 0,
        status: "active",
        variantCount: 1
      };

      // মাল্টিপার্ট ফর্মে ডেটা এবং ফাইল অ্যাপেন্ড করা
      formData.append("data", JSON.stringify(finalPayload));
      formData.append("file", mainImage); // ব্যাকএন্ড এই ফাইল আপলোড করে mainImage, images, এবং whiteBackgroundImage তে ইউআরএল বসিয়ে দেবে।

      const response = await addProduct(formData).unwrap();
      console.log(response);
      // return response;
    };

    try {
      await toast.promise(makeRequest(), {
        loading: 'Syncing product to alldata collection...',
        success: () => {
          form.reset();
          setMainImage(null);
          return 'Product successfully created in alldata! 🎉';
        },
        error: (err) => {
          console.error("Sync Error:", err);
          return `Error: ${err?.data?.message || "Failed to sync product"}`;
        },
      });
    } catch (error) {
      console.error("Submission Catch:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border rounded-2xl shadow-md bg-white">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Add New Product </h2>
        <p className="text-sm text-gray-500">Form fields are mapped directly to your database collection schema.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* আইডেন্টিফায়ার গ্রিড */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product ID (_id) *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 246364695" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="catId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category ID (catId) *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 10001019" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* নাম সমূহ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name (English) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product english name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nameBn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name (Bengali)</FormLabel>
                  <FormControl>
                    <Input placeholder="বাংলা নাম লিখুন (ঐচ্ছিক)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* প্রাইস ও স্টক */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regular Price *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="300" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="290" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="11" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="No Brand" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* SKU ও অন্যান্য ইনফো (অপশনাল - অটো জেনারেট হবে না দিলে) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/20 p-4 rounded-xl border">
            <FormField
              control={form.control}
              name="shopSku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Shop SKU (Optional)</FormLabel>
                  <FormControl><Input className="h-8 text-xs" placeholder="Auto-generated if empty" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sellerSku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Seller SKU (Optional)</FormLabel>
                  <FormControl><Input className="h-8 text-xs" placeholder="Auto-generated if empty" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skuId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">SKU ID (Optional)</FormLabel>
                  <FormControl><Input className="h-8 text-xs" placeholder="Auto-generated if empty" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ডেসক্রিপশন এবং হাইলাইটস */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="highlights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highlights</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Specifications:\nCan be applied to hood...\nEasy to install..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (HTML/Text)</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Write detailed description or paste HTML content..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ইমেজ আপলোডার সেকশন */}
          <div className="p-4 bg-slate-50 border border-dashed rounded-xl">
            <FormLabel className="mb-2 block font-semibold text-blue-700">Product Main Image</FormLabel>
            <SingleImageUploader onChange={setMainImage} />
            <p className="text-xs text-muted-foreground mt-2">This file will populate `mainImage`, `images[0]`, and `whiteBackgroundImage` automatically.</p>
          </div>

          <Button 
            disabled={isSubmitting} 
            type="submit" 
            className="w-full bg-[#FE6A00] hover:bg-[#FE6A00]/80 text-white py-3 rounded-xl font-medium transition-all"
          >
            {isSubmitting ? "Uploading & Syncing..." : "Add Product to alldata collection"}
          </Button>
        </form>
      </Form>
    </div>
  );
}