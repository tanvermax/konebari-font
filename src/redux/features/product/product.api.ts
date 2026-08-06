import { baseApi } from "@/redux/baseApi";

export const productapi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (addProduct) => ({
        url: "/alldata/create-product",
        method: "POST",
        data: addProduct,
      }),
      invalidatesTags: ["PRODUCT"],
    }),

    allpstock: builder.query({
      query: (params) => ({
        url: "/alldata",
        method: "GET",
        params: params,
      }),
      transformResponse: (arg) => arg, // { data: IProductCard[], meta: {...} }
      providesTags: ["PRODUCT"],
    }),

    pricestockDetails: builder.query({
      query: (id) => ({
        url: `/alldata/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 600, // 10 minutes
      transformResponse: (arg) => arg.data, // full IProduct doc
      providesTags: ["PRODUCT"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/alldata/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCT"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `/alldata/${id}`,
        method: "PATCH",
        data: updateData,
      }),
      invalidatesTags: ["PRODUCT"],
    }),
    adminOverview: builder.query({
      query: () => ({
        url: "/alldata/admin/overview",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["PRODUCT"],
    }),

    categories: builder.query({
      query: () => ({
        url: "/alldata/categories",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["PRODUCT"],
    }),
  }),
});

export const {
  usePricestockDetailsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useAllpstockQuery,
  useAdminOverviewQuery,
  useCategoriesQuery,
} = productapi;
