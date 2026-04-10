/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useCreateProductMutation } from "@/redux/features/product/product.api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SingleImageUploader from "./SingleImageUploader";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea"; // Recommended for description

interface IProduct {
  _id?: string;
  "Product ID": string;
  "*Product Name(English)": string;
  "Product Name(Bengali) look function"?: string;
  "Shop SKU": string;
  "catId": string;
  "*Quantity": number;
  "*Price": number;
  "currencyCode": string;
  "status": string;
  "SpecialPrice": number;
  Highlights: string;
  description: string;
  "White Background Image"?: string;
  images?: string;
  images2?: string;
  images3?: string;
  images4?: string;
  images5?: string;
  image6?: string;
}

export default function ProductAddForm() {
  const [addProduct] = useCreateProductMutation();
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<IProduct>({
   defaultValues: {
      "Product ID": undefined,
      "*Product Name(English)": "",
      "Product Name(Bengali) look function": "", // Added
      "catId": undefined, // Added
      "Shop SKU": "",
      "*Quantity": 1,
      "*Price": undefined,
      "SpecialPrice": undefined,
      "currencyCode": "BDT", // Added default
      "status": "active",    // Added default
      Highlights: "",
      description: "",
    },
  });

  const onSubmit = async (data: IProduct) => {
  if (!image) {
    toast.error("Please select a primary image");
    return;
  }

  setIsSubmitting(true);
  
  // Create a separate promise for the toast to watch
  const makeRequest = async () => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("file", image);
    
    // Explicitly unwrap the result
    const response = await addProduct(formData).unwrap();
    return response;
  };

  try {
    await toast.promise(makeRequest(), {
      loading: 'Adding product to inventory...',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      success: () => {
        form.reset();
        setImage(null);
        return 'Product added successfully! 🎉';
      },
      error: (err) => {
        // Log the error to see why it's failing
        console.error("Toast Error:", err);
        return `Error: ${err?.data?.message || "Failed to add"}`;
      },
    });
  } catch (error) {
    // This catches errors from the promise itself
    console.error("Submission Catch:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-bold mb-6">Add New Inventory Item</h2>

      <Form {...form}>
        <form id="add-product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="Product ID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product ID</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value)} />
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
                  <FormLabel>Category ID</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Shop SKU"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 246596-BD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="Product Name(Bengali) look function"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name (Bengali)</FormLabel>
                <FormControl>
                  <Input placeholder="বাংলা নাম লিখুন" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="*Product Name(English)"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name (English) *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter English name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="*Price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (BDT) *</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="SpecialPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="*Quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity *</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="Highlights"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Highlights</FormLabel>
                <FormControl>
                  <Input placeholder="Key features..." {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Detailed description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="p-4 bg-slate-50 rounded-md border-dashed border-2">
            <FormLabel className="mb-2 block font-semibold text-blue-700">Primary Product Image</FormLabel>
            <SingleImageUploader onChange={setImage} />
            <p className="text-xs text-gray-500 mt-2 italic">This image will be used as the main thumbnail.</p>
          </div>

          <Button 
            disabled={isSubmitting} 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Processing..." : "Sync Product to Store"}
          </Button>
        </form>
      </Form>
    </div>
  );
}