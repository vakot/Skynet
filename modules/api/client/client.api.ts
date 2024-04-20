import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User } from 'discord.js'
import { IApiGuild } from './client.api.types'

export const clientApi = createApi({
  reducerPath: 'clientApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getClient: builder.query<User, void>({
      query: () => 'client',
    }),
    getClientGuilds: builder.query<IApiGuild[], string>({
      query: (username) => ({
        url: 'client/mutual',
        method: 'GET',
        params: { username },
      }),
    }),
  }),
})

export const { useGetClientQuery, useGetClientGuildsQuery } = clientApi
