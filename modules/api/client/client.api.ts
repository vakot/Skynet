import {
  GetClientGuildRequest,
  GetClientGuildResponse,
  GetClientGuildsRequest,
  GetClientGuildsResponse,
  GetClientRequest,
  GetClientResponse,
} from '@modules/api/client/client.api.types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const clientApi = createApi({
  reducerPath: 'clientApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getClient: builder.query<GetClientResponse, GetClientRequest>({
      query: () => 'client',
    }),
    getClientGuilds: builder.query<GetClientGuildsResponse, GetClientGuildsRequest>({
      query: (query) => ({
        url: 'client/guild',
        method: 'GET',
        ...(!!query && { query }),
      }),
    }),
    getClientGuild: builder.query<GetClientGuildResponse, GetClientGuildRequest>({
      query: (id) => ({
        url: `client/guild/${id}`,
        method: 'GET',
      }),
    }),
    getPermissionFlagsBits: builder.query<any, void>({
      query: () => ({
        url: `client/permissions`,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useGetClientQuery,
  useGetClientGuildsQuery,
  useGetClientGuildQuery,
  useGetPermissionFlagsBitsQuery,
} = clientApi
