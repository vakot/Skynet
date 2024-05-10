import { IGuild } from '@bot/models/guild'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const guildApi = createApi({
  reducerPath: 'guildApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getGuilds: builder.query<IGuild[], { ids?: string[] | string } | void>({
      query: (query) => ({
        url: 'guild',
        method: 'GET',
        ...(!!query && { query }),
      }),
    }),
    getGuild: builder.query<IGuild, string | undefined>({
      query: (id) => ({
        url: `guild/${id}`,
        method: 'GET',
      }),
    }),
    addGuild: builder.mutation<IGuild, Partial<Omit<IGuild, '_id'>>>({
      query: (body) => ({
        url: 'guild',
        method: 'POST',
        body,
      }),
    }),
    editGuild: builder.mutation<IGuild, Partial<Omit<IGuild, '_id'>>>({
      query: ({ id, ...body }) => ({
        url: `guild/${id}`,
        method: 'PATCH',
        body,
      }),
    }),
  }),
})

export const { useGetGuildsQuery, useGetGuildQuery, useAddGuildMutation, useEditGuildMutation } =
  guildApi
