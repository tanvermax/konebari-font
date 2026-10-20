import {createApi} from "@reduxjs/toolkit/query/react"
import axiosBaseQuery from "./axiosBaseQuery"

export const baseApi = createApi({
    reducerPath:'baseApi',
    baseQuery: axiosBaseQuery(),
    tagTypes:["USER","PRODUCT","BRAND","COIN",'Cart',"NOTIFICATION","Favorite","ORDER"],
    refetchOnMountOrArgChange: true,
    endpoints: ()=>({})
})
