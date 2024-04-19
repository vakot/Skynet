import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Guild, User } from 'discord.js'

export const clientApi = createApi({
  reducerPath: 'clientApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getClientUser: builder.query<User, void>({
      query: () => 'client/user',
    }),
    getClientMutualGuilds: builder.query<Guild[], string>({
      query: (username) => ({
        url: 'client/mutual',
        method: 'GET',
        params: { username },
      }),
    }),
  }),
})

export const { useGetClientUserQuery, useGetClientMutualGuildsQuery } = clientApi
