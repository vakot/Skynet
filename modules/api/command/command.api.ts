import type {
  GetCommandRequest,
  GetCommandResponse,
  GetCommandsRequest,
  GetCommandsResponse,
  PatchCommandRequest,
  PatchCommandResponse,
  PostCommandRequest,
  PostCommandResponse,
} from '@modules/api/command/command.api.types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const commandApi = createApi({
  reducerPath: 'commandApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getCommands: builder.query<GetCommandsResponse, GetCommandsRequest>({
      query: (query) => ({
        url: 'client/command',
        method: 'GET',
        ...(!!query && { query }),
      }),
    }),
    getCommand: builder.query<GetCommandResponse, GetCommandRequest>({
      query: (id) => ({
        url: `client/command/${id}`,
        method: 'GET',
      }),
    }),
    addCommand: builder.mutation<PostCommandResponse, PostCommandRequest>({
      query: ({ guild, ...body }) => ({
        url: `client/command?guild=${guild}`,
        method: 'POST',
        body,
      }),
    }),
    editCommand: builder.mutation<PatchCommandResponse, PatchCommandRequest>({
      query: ({ guild, id, ...body }) => ({
        url: `client/command/${id}?guild=${guild}`,
        method: 'PATCH',
        body,
      }),
    }),
  }),
})

export const {
  useGetCommandsQuery,
  useGetCommandQuery,
  useAddCommandMutation,
  useEditCommandMutation,
} = commandApi
