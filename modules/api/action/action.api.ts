import {
  GetActionRequest,
  GetActionResponse,
  GetActionsRequest,
  GetActionsResponse,
  PatchActionRequest,
  PatchActionResponse,
  PostActionRequest,
  PostActionResponse,
} from '@modules/api/action/action.api.types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const actionApi = createApi({
  reducerPath: 'actionApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['Action'],
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getActions: builder.query<GetActionsResponse, GetActionsRequest>({
      query: (query) => ({
        url: 'action',
        method: 'GET',
        ...(!!query && { query }),
      }),
      providesTags: ['Action'],
    }),
    getAction: builder.query<GetActionResponse, GetActionRequest>({
      query: (id) => ({
        url: `action/${id}`,
        method: 'GET',
      }),
      providesTags: ['Action'],
    }),
    addAction: builder.mutation<PostActionResponse, PostActionRequest>({
      query: (body) => ({
        url: `action`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Action'],
    }),
    editAction: builder.mutation<PatchActionResponse, PatchActionRequest>({
      query: ({ id, ...body }) => ({
        url: `action/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Action'],
    }),
  }),
})

export const {
  useGetActionsQuery,
  useGetActionQuery,
  useAddActionMutation,
  useEditActionMutation,
} = actionApi
