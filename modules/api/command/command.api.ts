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
  tagTypes: ['Command'],
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getCommands: builder.query<GetCommandsResponse, GetCommandsRequest>({
      query: (query) => ({
        url: 'command',
        method: 'GET',
        ...(!!query && { params: query }),
      }),
      providesTags: ['Command'],
    }),
    getCommand: builder.query<GetCommandResponse, GetCommandRequest>({
      query: (id) => ({
        url: `command/${id}`,
        method: 'GET',
      }),
      providesTags: ['Command'],
    }),
    addCommand: builder.mutation<PostCommandResponse, PostCommandRequest>({
      query: ({ guild, ...body }) => ({
        url: guild ? `command?guild=${guild}` : 'command',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Command'],
    }),
    editCommand: builder.mutation<PatchCommandResponse, PatchCommandRequest>({
      query: ({ guild, id, ...body }) => ({
        url: guild ? `command/${id}?guild=${guild}` : `command/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Command'],
    }),
  }),
})

export const {
  useGetCommandsQuery,
  useGetCommandQuery,
  useAddCommandMutation,
  useEditCommandMutation,
} = commandApi
