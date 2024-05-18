import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  GetEmbedRequest,
  GetEmbedResponse,
  GetEmbedsRequest,
  GetEmbedsResponse,
  PatchEmbedRequest,
  PatchEmbedResponse,
  PostEmbedRequest,
  PostEmbedResponse,
} from './embed.api.types'

export const embedApi = createApi({
  reducerPath: 'embedApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['Embed'],
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getEmbeds: builder.query<GetEmbedsResponse, GetEmbedsRequest>({
      query: (query) => ({
        url: 'embed',
        method: 'GET',
        ...(!!query && { params: query }),
      }),
      providesTags: ['Embed'],
    }),
    getEmbed: builder.query<GetEmbedResponse, GetEmbedRequest>({
      query: (id) => ({
        url: `embed/${id}`,
        method: 'GET',
      }),
      providesTags: ['Embed'],
    }),
    addEmbed: builder.mutation<PostEmbedResponse, PostEmbedRequest>({
      query: (body) => ({
        url: `embed`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Embed'],
    }),
    editEmbed: builder.mutation<PatchEmbedResponse, PatchEmbedRequest>({
      query: ({ id, ...body }) => ({
        url: `embed/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Embed'],
    }),
  }),
})

export const { useGetEmbedsQuery, useGetEmbedQuery, useAddEmbedMutation, useEditEmbedMutation } =
  embedApi
