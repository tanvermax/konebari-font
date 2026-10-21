// redux/features/review/review.api.ts
import { baseApi } from "@/redux/baseApi";

export interface IReview {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  isVerifiedPurchase?: boolean;
  createdAt: string;
}

export interface ITopReview {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  avatar?: string | null;
  productName: string;
  productSlug?: string;
  productImage?: string | null;
  createdAt: string;
}


export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<IReview[], string>({
      query: (productId) => ({
        url: `/reviews/product/${productId}`,
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data || res || [],
      providesTags: ["REVIEW"],
    }),

    createReview: builder.mutation<
      IReview,
      { productId: string; rating: number; comment?: string }
    >({
      query: (data) => ({
        url: "/reviews/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["REVIEW", "PRODUCT"],
    }),

    deleteReview: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["REVIEW", "PRODUCT"],
    }),
    getTopReviews: builder.query<ITopReview[], { limit?: number } | void>({
      query: (params) => ({
        url: "/reviews/top",
        method: "GET",
        params: params || { limit: 6 },
      }),
      transformResponse: (res: any) => res?.data || res || [],
      providesTags: ["REVIEW"],
    }),

  }),
});

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetTopReviewsQuery
} = reviewApi;