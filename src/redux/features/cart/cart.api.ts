// redux/features/cart/cart.api.ts
import { baseApi } from "@/redux/baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Add to Cart
    addToCart: builder.mutation({
      query: (payload) => ({
        url: "/cart/add",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ Get Cart
    getCart: builder.query({
      query: () => ({
        url: "/cart",
        method: "GET",
      }),
      transformResponse: (res: any) => res.data,
      providesTags: ["Cart"],
    }),

    // ✅ Update Quantity
    updateCartItem: builder.mutation({
      query: (payload) => ({
        url: "/cart/update",
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ Remove Item
    removeCartItem: builder.mutation({
      query: (payload) => ({
        url: "/cart/remove",
        method: "DELETE",
        data: payload,
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ Clear Cart
    clearCart: builder.mutation({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ Merge Guest Cart
    mergeCart: builder.mutation({
      query: (payload) => ({
        url: "/cart/merge",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useMergeCartMutation,
} = cartApi;