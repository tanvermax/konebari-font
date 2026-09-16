import { baseApi } from "@/redux/baseApi";
import type {  IResponse, ISendOtp, IVerifyOtp } from "@/types";


export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userInfo) => ({
                url: "user/register",
                method: "POST",
                data: userInfo
            }),
            
        }),
        login: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/login",
                method: "POST",
                data: userInfo,
                withCredentials: true,
            }),
            
            
        })
        ,
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags:["USER"]
        }),
         sendOtp: builder.mutation<IResponse<null>,ISendOtp>({
            query: (userInfo) => ({
                url: "/otp/send",
                method: "POST",
                data: userInfo
            })
        }),
         verifyOtp: builder.mutation<IResponse<null>,IVerifyOtp>({
            query: (userInfo) => ({
                url: "/otp/verify",
                method: "POST",
                data: userInfo
            })
        }),
        userInfo: builder.query({
            query: () => ({
                url: "/user/me",
                method: "GET",
                withCredentials: true
            }),
            providesTags:["USER"]
        }),
        updateProfile: builder.mutation({
      query: (updateData) => ({
        url: "/user/update-profile",
        method: "PATCH",
        data: updateData,
      }),
      invalidatesTags: ["USER"],
    }),

    })
})

export const {useUserInfoQuery, useLogoutMutation,useRegisterMutation,useLoginMutation,useSendOtpMutation,useVerifyOtpMutation,useUpdateProfileMutation } = authApi