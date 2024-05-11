import {
  GetListenerRequest,
  GetListenerResponse,
  GetListenersRequest,
  GetListenersResponse,
  PatchListenerRequest,
  PatchListenerResponse,
  PostListenerRequest,
  PostListenerResponse,
} from '@modules/api/listener/listener.api.types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const listenerApi = createApi({
  reducerPath: 'listenerApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getListeners: builder.query<GetListenersResponse, GetListenersRequest>({
      query: (query) => ({
        url: 'listener',
        method: 'GET',
        ...(!!query && { params: query }),
      }),
    }),
    getListener: builder.query<GetListenerResponse, GetListenerRequest>({
      query: (id) => ({
        url: `listener/${id}`,
        method: 'GET',
      }),
    }),
    addListener: builder.mutation<PostListenerResponse, PostListenerRequest>({
      query: (body) => ({
        url: 'listener',
        method: 'POST',
        body,
      }),
    }),
    editListener: builder.mutation<PatchListenerResponse, PatchListenerRequest>({
      query: ({ id, ...body }) => ({
        url: `listener/${id}`,
        method: 'PATCH',
        body,
      }),
    }),
  }),
})

export const {
  useGetListenersQuery,
  useGetListenerQuery,
  useAddListenerMutation,
  useEditListenerMutation,
} = listenerApi
