import { IClientGuild, IClientUser } from '@modules/api/client/client.api.types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const clientApi = createApi({
  reducerPath: 'clientApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getClient: builder.query<IClientUser, void>({
      query: () => 'client',
    }),
    getClientGuilds: builder.query<IClientGuild[], string[] | string | undefined | void>({
      query: (ids) => ({
        url: 'client/guild',
        method: 'GET',
        query: { ids },
      }),
    }),
    getClientGuildById: builder.query<IClientGuild, string[] | string | undefined | void>({
      query: (id) => ({
        url: `client/guild/${id}`,
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetClientQuery, useGetClientGuildsQuery, useGetClientGuildByIdQuery } = clientApi
