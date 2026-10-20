// redux/features/coin/coin.api.ts
import { baseApi } from "@/redux/baseApi";

export const coinApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ My coins + history
    getMyCoins: builder.query({
      query: (params) => ({
        url: "/coins",
        method: "GET",
        params,
      }),
      transformResponse: (res: any) => res?.data || res,
      providesTags: ["COIN"],
    }),

    // ✅ Balance only (for navbar — fast)
    getCoinBalance: builder.query({
      query: () => ({
        url: "/coins/balance",
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data || res,
      providesTags: ["COIN"],
    }),
  }),
});

export const { useGetMyCoinsQuery, useGetCoinBalanceQuery } = coinApi;