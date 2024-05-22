import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  GetMessageRequest,
  GetMessageResponse,
  GetMessagesRequest,
  GetMessagesResponse,
  PatchMessageRequest,
  PatchMessageResponse,
  PostMessageRequest,
  PostMessageResponse,
  SendMessageRequest,
  SendMessageResponse,
} from './message.api.types'

export const messageApi = createApi({
  reducerPath: 'messageApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['Message'],
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getMessages: builder.query<GetMessagesResponse, GetMessagesRequest>({
      query: (query) => ({
        url: 'message',
        method: 'GET',
        ...(!!query && { params: query }),
      }),
      providesTags: ['Message'],
    }),
    getMessage: builder.query<GetMessageResponse, GetMessageRequest>({
      query: (id) => ({
        url: `message/${id}`,
        method: 'GET',
      }),
      providesTags: ['Message'],
    }),
    addMessage: builder.mutation<PostMessageResponse, PostMessageRequest>({
      query: (body) => ({
        url: `message`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Message'],
    }),
    editMessage: builder.mutation<PatchMessageResponse, PatchMessageRequest>({
      query: ({ id, ...body }) => ({
        url: `message/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Message'],
    }),
    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: ({ message: messageId, channel: channelId, guild: guildId }) => ({
        url: `message/${messageId}?guild=${guildId}&channel=${channelId}`,
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useGetMessagesQuery,
  useGetMessageQuery,
  useAddMessageMutation,
  useEditMessageMutation,
  useSendMessageMutation,
} = messageApi
