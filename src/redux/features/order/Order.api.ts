import { baseApi } from "@/redux/baseApi";

export const Orderapi = baseApi.injectEndpoints({
  
  endpoints: (builder) => ({

    allOrder: builder.query({
      query: () => ({
        url: "/order",
        method: "GET",
      }),
      providesTags: ['ORDER'],
      //   transformResponse: (arg) => arg.data,
    }),
    Order: builder.mutation({
      query: (order) => {
        return {
          url: '/product/order',
          method: 'POST',
          data: order
        };
      },
      invalidatesTags: ['ORDER'],
    }),
    updateOrder: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/order/${id}`,
        method: "PATCH",
        data: updatedData
      }),
      invalidatesTags: ['ORDER'],
    }),
    confirmOrder: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/order/orderconfirm/${id}`,
        method: "PATCH",
        data: updatedData
      }),
      invalidatesTags: ['ORDER'],
    }),
    confirmOrdernonUser: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/order/orderconfirmnonuser/${id}`,
        method: "PATCH",
        data: updatedData
      }),
      invalidatesTags: ['ORDER'],
    }),
    getAdminDashboardStats: builder.query({
  query: () => ({
    url: "/order/admin/dashboard-stats",
    method: "GET",
  }),
  providesTags: ['ORDER'],
}),
    deleteOrder: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/order/${id}`,
        method: "DELETE",
        data: updatedData

      }),
      invalidatesTags: ['ORDER'],
    }),
    AdminupdateOrder: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/order/admin/${id}`,
        method: 'PATCH',
        data: updatedData ,
      }),
      invalidatesTags: ['ORDER'],
    }),
    allOrderForAdmin: builder.query({
      query: () => ({
        url: "/order/admin",
        method: "GET",
      }),
      providesTags: ['ORDER'],
      //   transformResponse: (arg) => arg.data,
    }),

  }),
});


export const { useDeleteOrderMutation,useGetAdminDashboardStatsQuery, useAllOrderForAdminQuery, useAdminupdateOrderMutation, useAllOrderQuery, useUpdateOrderMutation, useOrderMutation, useConfirmOrderMutation, useConfirmOrdernonUserMutation } = Orderapi
