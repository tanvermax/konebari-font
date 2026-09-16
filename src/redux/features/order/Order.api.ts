// redux/features/order/Order.api.ts
import { baseApi } from "@/redux/baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create Order (Guest + Logged-in)
    createOrder: builder.mutation({
      query: (payload) => ({
        url: "/orders/create-order",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["ORDER"],
    }),

    // ✅ Get All Orders (Admin)
    getAllOrders: builder.query({
      query: (params) => ({
        url: "/orders",
        method: "GET",
        params,
      }),
      transformResponse: (res: any) => res,
      providesTags: ["ORDER"],
    }),

    // ✅ Get Single Order
    getOrderById: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      transformResponse: (res: any) => res.data || res,
      providesTags: ["ORDER"],
    }),

    // ✅ Update Order (Status, payment, courier)
    updateOrder: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        data: updateData,
      }),
      invalidatesTags: ["ORDER"],
    }),

    // ✅ Delete Order
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ORDER"],
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: "/orders/my-orders",             // 👈 NEW endpoint
        method: "GET",
      }),
      transformResponse: (res: any) => res,
      providesTags: ["ORDER"],
    }),
  }),
  
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;