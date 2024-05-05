import { IGuild } from '@bot/models/guild'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const guildApi = createApi({
  reducerPath: 'guildApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getGuilds: builder.query<IGuild[], string[] | string | undefined | void>({
      query: (ids) => ({
        url: 'guild',
        method: 'GET',
        query: { ids },
      }),
    }),
    getGuildById: builder.query<IGuild, string | undefined | void>({
      query: (id) => ({
        url: `guild/${id}`,
        method: 'GET',
      }),
    }),
    postGuild: builder.mutation<IGuild, Partial<IGuild>>({
      query: ({ id, ...body }) => ({
        url: `guild/${id}`,
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useGetGuildsQuery, useGetGuildByIdQuery, usePostGuildMutation } = guildApi
