// redux/features/favorite/favorite.api.ts
import { baseApi } from "@/redux/baseApi";

export const favoriteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Add Favorite
    addFavorite: builder.mutation({
      query: (payload) => ({
        url: "/favorites/add",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Favorite"],
    }),

    // ✅ Get Favorites
    getFavorites: builder.query({
      query: () => ({
        url: "/favorites",
        method: "GET",
      }),
      transformResponse: (res: any) => res.data,
      providesTags: ["Favorite"],
    }),

    // ✅ Remove Favorite
    removeFavorite: builder.mutation({
      query: (payload) => ({
        url: "/favorites/remove",
        method: "DELETE",
        data: payload,
      }),
      invalidatesTags: ["Favorite"],
    }),

    // ✅ Merge Guest Favorites
    mergeFavorites: builder.mutation({
      query: (payload) => ({
        url: "/favorites/merge",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Favorite"],
    }),
  }),
});

export const {
  useAddFavoriteMutation,
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
  useMergeFavoritesMutation,
} = favoriteApi;