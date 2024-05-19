import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  GetComponentRequest,
  GetComponentResponse,
  GetComponentsRequest,
  GetComponentsResponse,
  PatchComponentRequest,
  PatchComponentResponse,
  PostComponentRequest,
  PostComponentResponse,
} from './component.api.types'

export const messageComponentApi = createApi({
  reducerPath: 'messageComponentApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['MessageComponent'],
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getMessageComponents: builder.query<GetComponentsResponse, GetComponentsRequest>({
      query: (query) => ({
        url: 'message/component',
        method: 'GET',
        ...(!!query && { params: query }),
      }),
      providesTags: ['MessageComponent'],
    }),
    getMessageComponent: builder.query<GetComponentResponse, GetComponentRequest>({
      query: (id) => ({
        url: `message/component/${id}`,
        method: 'GET',
      }),
      providesTags: ['MessageComponent'],
    }),
    addMessageComponent: builder.mutation<PostComponentResponse, PostComponentRequest>({
      query: (body) => ({
        url: `message/component`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MessageComponent'],
    }),
    editMessageComponent: builder.mutation<PatchComponentResponse, PatchComponentRequest>({
      query: ({ id, ...body }) => ({
        url: `message/component/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['MessageComponent'],
    }),
  }),
})

export const {
  useGetMessageComponentsQuery,
  useGetMessageComponentQuery,
  useAddMessageComponentMutation,
  useEditMessageComponentMutation,
} = messageComponentApi
