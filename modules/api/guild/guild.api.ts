import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  GetGuildRequest,
  GetGuildResponse,
  GetGuildsRequest,
  GetGuildsResponse,
} from './guild.api.types'

export const guildApi = createApi({
  reducerPath: 'guildApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['Guild'],
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getGuilds: builder.query<GetGuildsResponse, GetGuildsRequest>({
      query: (query) => ({
        url: 'guild',
        method: 'GET',
        ...(!!query && { params: query }),
      }),
      providesTags: ['Guild'],
    }),
    getGuild: builder.query<GetGuildResponse, GetGuildRequest>({
      query: (id) => ({
        url: `guild/${id}`,
        method: 'GET',
      }),
      providesTags: ['Guild'],
    }),
  }),
})

export const { useGetGuildsQuery, useGetGuildQuery } = guildApi
