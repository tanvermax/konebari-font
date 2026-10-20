// redux/features/brand/brand.api.ts
import { baseApi } from "@/redux/baseApi";

export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  logoPublicId?: string;
  description?: string;
  website?: string;
  isActive: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Public — active brands for slider
    getActiveBrands: builder.query<IBrand[], { limit?: number } | void>({
      query: (params) => ({
        url: "/brands",
        method: "GET",
        params: params ? { activeOnly: "false", ...params } : { activeOnly: "true" },
      }),
      transformResponse: (res: any) => res?.data || res || [],
      providesTags: ["BRAND"],
    }),

    // ✅ Admin — all brands
    getAllBrands: builder.query<IBrand[], Record<string, any> | void>({
      query: (params) => ({
        url: "/brands",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (res: any) => res?.data || res || [],
      providesTags: ["BRAND"],
    }),

    // ✅ Single brand by id
    getSingleBrand: builder.query<IBrand, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data || res,
      providesTags: ["BRAND"],
    }),

    // ✅ Brand by slug
    getBrandBySlug: builder.query<IBrand, string>({
      query: (slug) => ({
        url: `/brands/slug/${slug}`,
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data || res,
      providesTags: ["BRAND"],
    }),

    // ✅ Create brand (multipart form-data)
    createBrand: builder.mutation<IBrand, FormData>({
      query: (formData) => ({
        url: "/brands/create",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["BRAND"],
    }),

    // ✅ Update brand (optional logo)
    updateBrand: builder.mutation<IBrand, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/brands/${id}`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["BRAND"],
    }),

    // ✅ Toggle status
    toggleBrandStatus: builder.mutation<IBrand, string>({
      query: (id) => ({
        url: `/brands/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["BRAND"],
    }),

    // ✅ Reorder
    reorderBrands: builder.mutation<
      { message: string },
      Array<{ id: string; displayOrder: number }>
    >({
      query: (orders) => ({
        url: "/brands/reorder/all",
        method: "PATCH",
        data: { orders },
      }),
      invalidatesTags: ["BRAND"],
    }),

    // ✅ Delete
    deleteBrand: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BRAND"],
    }),
  }),
});

export const {
  useGetActiveBrandsQuery,
  useGetAllBrandsQuery,
  useGetSingleBrandQuery,
  useGetBrandBySlugQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useToggleBrandStatusMutation,
  useReorderBrandsMutation,
  useDeleteBrandMutation,
} = brandApi;