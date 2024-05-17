import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  GetListenerRequest,
  GetListenerResponse,
  GetListenersRequest,
  GetListenersResponse,
  PatchListenerRequest,
  PatchListenerResponse,
  PostListenerRequest,
  PostListenerResponse,
} from './listener.api.types'

export const listenerApi = createApi({
  reducerPath: 'listenerApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['Listener'],
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getListeners: builder.query<GetListenersResponse, GetListenersRequest>({
      query: (query) => ({
        url: 'listener',
        method: 'GET',
        ...(!!query && { params: query }),
      }),
      providesTags: ['Listener'],
    }),
    getListener: builder.query<GetListenerResponse, GetListenerRequest>({
      query: (id) => ({
        url: `listener/${id}`,
        method: 'GET',
      }),
      providesTags: ['Listener'],
    }),
    addListener: builder.mutation<PostListenerResponse, PostListenerRequest>({
      query: (body) => ({
        url: 'listener',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Listener'],
    }),
    editListener: builder.mutation<PatchListenerResponse, PatchListenerRequest>({
      query: ({ id, ...body }) => ({
        url: `listener/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Listener'],
    }),
  }),
})

export const {
  useGetListenersQuery,
  useGetListenerQuery,
  useAddListenerMutation,
  useEditListenerMutation,
} = listenerApi
