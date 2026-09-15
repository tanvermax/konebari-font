// redux/features/user/user.api.ts
import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All Users
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/user/all-users",
        method: "GET",
        params: params,
      }),
      transformResponse: (response: any) => response,
      providesTags: ["USER"],
    }),

    // ✅ Get Single User
    getSingleUser: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["USER"],
    }),

    // ✅ Update User (name, email, role)
    updateUser: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        data: updateData,
      }),
      invalidatesTags: ["USER"],
    }),

    // ✅ Delete User
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USER"],
    }),

    // ✅ Block / Unblock User
    toggleUserStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/user/${id}/status`,
        method: "PATCH",
        data: { isActive },
      }),
      invalidatesTags: ["USER"],
    }),

    // ✅ Change Role
    changeUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/user/${id}/role`,
        method: "PATCH",
        data: { role },
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  useChangeUserRoleMutation,
} = userApi;