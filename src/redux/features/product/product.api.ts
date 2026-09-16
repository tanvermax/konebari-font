// product.api.ts
import { baseApi } from "@/redux/baseApi";

export const productapi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ 1. createProduct - FormData সঠিকভাবে পাঠানোর জন্য body ব্যবহার করা হয়েছে
    createProduct: builder.mutation({
      query: (addProduct) => ({
        url: "/products/create-product",
        method: "POST",
        data: addProduct,
       
      }),
      invalidatesTags: ["PRODUCT"],
    }),
    // ✅ Get Single Product Query (id or slug)
    getSingleProduct: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 600, // 10 Minutes Cache
      transformResponse: (response: any) => response?.data || response,
      providesTags: ( id) => [{ type: "PRODUCT", id }],
    }),

    // ✅ 2. All Products Query
    allpstock: builder.query({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params: params,
      }),
      transformResponse: (arg: any) => arg,
      providesTags: ["PRODUCT"],
    }),

    // ✅ 3. Single Product Details Query
    pricestockDetails: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 600,
      transformResponse: (arg: any) => arg.data,
      providesTags: ["PRODUCT"],
    }),

    // ✅ 4. Delete Product Mutation
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCT"],
    }),

    // ✅ 5. Update Product Mutation
    updateProduct: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        data: updateData, 
      }),
      invalidatesTags: ["PRODUCT"],
    }),

    // ✅ 6. Admin Overview Query
    adminOverview: builder.query({
      query: () => ({
        url: "/products/admin/overview",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["PRODUCT"],
    }),

    // ✅ 7. Categories Query
    // redux/features/product/product.api.ts
categories: builder.query({
  query: () => ({
    url: "/products/categories",
    method: "GET",
  }),
  transformResponse: (res: any) => {
    console.log("📦 Categories API response:", res);
    // ✅ Return the array (response.data)
    return res?.data || res || [];
  },
  providesTags: ["PRODUCT"],
}),

brands: builder.query({
  query: () => ({
    url: "/products/brands",
    method: "GET",
  }),
  transformResponse: (res: any) => res?.data || res || [],
  providesTags: ["PRODUCT"],
}),

  }),
});

export const {
  usePricestockDetailsQuery,
    useBrandsQuery,         // 👈 নতুন

  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useAllpstockQuery,
  useGetSingleProductQuery,
  useAdminOverviewQuery,
  useCategoriesQuery,
} = productapi;