// redux/features/subcategory/subcategory.api.ts
import { baseApi } from "@/redux/baseApi";

export interface ISubCategory {
  _id: string;
  name: string;
  categoryId: string; // Parent category er ID
  image?: string;
  slug?: string;
  isActive?: boolean;
}

export const subCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All SubCategories
    getSubCategories: builder.query<ISubCategory[], void>({
      query: () => ({
        url: "/subcategories",
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data || res || [],
      providesTags: ["SUBCATEGORY"],
    }),

    // ✅ Create SubCategory
    createSubCategory: builder.mutation<ISubCategory, FormData>({
      query: (formData) => ({
        url: "/subcategories/create",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["SUBCATEGORY", "CATEGORY", "PRODUCT"],
    }),

    // ✅ Delete SubCategory
    deleteSubCategory: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/subcategories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SUBCATEGORY", "CATEGORY", "PRODUCT"],
    }),
  }),
});

export const {
  useGetSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApi;