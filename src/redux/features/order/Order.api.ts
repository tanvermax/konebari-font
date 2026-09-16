// redux/features/order/order.api.ts
import { baseApi } from "@/redux/baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create Order (Guest or Logged-in)
    createOrder: builder.mutation({
      query: (payload) => ({
        url: "/orders/create",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["ORDER", "Cart"],
    }),

    // ✅ Get My Orders
    getMyOrders: builder.query({
      query: () => ({
        url: "/orders/my-orders",
        method: "GET",
      }),
      transformResponse: (res: any) => res.data,
      providesTags: ["ORDER"],
    }),

    // ✅ Get Single Order
    getOrderById: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      transformResponse: (res: any) => res.data,
      providesTags: ["ORDER"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
} = orderApi;