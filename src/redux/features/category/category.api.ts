// redux/features/category/category.api.ts
import { baseApi } from "@/redux/baseApi";

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Public — all active categories
    getCategories: builder.query<ICategory[], void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data || res || [],
      providesTags: ["CATEGORY"],
    }),

    // ✅ Admin — create with image
    createCategory: builder.mutation<ICategory, FormData>({
      query: (formData) => ({
        url: "/categories/create",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["CATEGORY", "PRODUCT"],
    }),

    // ✅ Admin — update with optional image
    updateCategory: builder.mutation<ICategory, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["CATEGORY", "PRODUCT"],
    }),

    // ✅ Admin — delete
    deleteCategory: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CATEGORY", "PRODUCT"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;