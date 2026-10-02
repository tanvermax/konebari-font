// redux/features/admin/admin.api.ts
import { baseApi } from "@/redux/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get Dashboard Overview
    getAdminOverview: builder.query({
      query: () => ({
        url: "/admin/overview",
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data || res,
      providesTags: ["PRODUCT", "USER", "ORDER"],
    }),

    // ✅ Get User Stats
    getUserStats: builder.query({
      query: () => ({
        url: "/admin/user-stats",
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data || res,
      providesTags: ["USER"],
    }),

    // ✅ Get Order Stats
    getOrderStats: builder.query({
      query: () => ({
        url: "/admin/order-stats",
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data || res,
      providesTags: ["ORDER"],
    }),

    // ✅ Clear Cache (dev only)
    clearAdminCache: builder.mutation({
      query: () => ({
        url: "/admin/cache",
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCT", "USER", "ORDER"],
    }),
  }),
});

export const {
  useGetAdminOverviewQuery,
  useGetUserStatsQuery,
  useGetOrderStatsQuery,
  useClearAdminCacheMutation,
} = adminApi;