import {
  GetPermissionRequest,
  GetPermissionResponse,
  GetPermissionsRequest,
  GetPermissionsResponse,
} from '@modules/api/permission/permission.api.types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const permissionApi = createApi({
  reducerPath: 'permissionApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['Permission'],
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getPermissionsFlagsBits: builder.query<GetPermissionsResponse, GetPermissionsRequest>({
      query: (query) => ({
        url: 'permission',
        method: 'GET',
      }),
      providesTags: ['Permission'],
    }),
    getPermissionFlags: builder.query<GetPermissionResponse, GetPermissionRequest>({
      query: (bit) => ({
        url: `permission/${bit}`,
        method: 'GET',
      }),
      providesTags: ['Permission'],
    }),
  }),
})

export const { useGetPermissionsFlagsBitsQuery, useGetPermissionFlagsQuery } = permissionApi
