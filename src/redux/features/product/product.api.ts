import { baseApi } from "@/redux/baseApi";

export const productapi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (addProduct) => {
        return {
          url: '/pricestocks/create-product',
          method: 'POST',
          data: addProduct
        };
      },
      invalidatesTags: ['PRODUCT'],
    }),
    allproduct: builder.query({
      query: () => ({
        url: "/product",
        method: "GET",
      }),
      transformResponse: (arg) => arg.data,
    }),
    allpstock: builder.query({
      query: (params) => ({
        url: "/pricestocks",
        method: "GET",
        params: params, 
      }),
      transformResponse: (arg) => arg,
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['PRODUCT'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `/product/${id}`,
        method: "PATCH",
        data: updateData
      }),
      invalidatesTags: ['PRODUCT'],
    }),
    pricestockDetails: builder.query({
      query: (id) => ({
        url: `/pricestocks/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 600, // 10 minutes
      providesTags: ['PRODUCT'],
      // transformResponse: (arg) => arg.data.data,
    }),

  }),
});


export const { useAllpstockQuery, useAllproductQuery, usePricestockDetailsQuery, useCreateProductMutation, useDeleteProductMutation } = productapi
