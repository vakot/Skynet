import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  GetAutomationRequest,
  GetAutomationResponse,
  GetAutomationsRequest,
  GetAutomationsResponse,
  PatchAutomationRequest,
  PatchAutomationResponse,
  PostAutomationRequest,
  PostAutomationResponse,
} from './automation.api.types'

export const automationApi = createApi({
  reducerPath: 'automationApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['Automation'],
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getAutomations: builder.query<GetAutomationsResponse, GetAutomationsRequest>({
      query: (query) => ({
        url: 'automation',
        method: 'GET',
        ...(!!query && { params: query }),
      }),
      providesTags: ['Automation'],
    }),
    getAutomation: builder.query<GetAutomationResponse, GetAutomationRequest>({
      query: (id) => ({
        url: `automation/${id}`,
        method: 'GET',
      }),
      providesTags: ['Automation'],
    }),
    addAutomation: builder.mutation<PostAutomationResponse, PostAutomationRequest>({
      query: (body) => ({
        url: 'automation',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Automation'],
    }),
    editAutomation: builder.mutation<PatchAutomationResponse, PatchAutomationRequest>({
      query: ({ id, ...body }) => ({
        url: `automation/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Automation'],
    }),
  }),
})

export const {
  useGetAutomationsQuery,
  useGetAutomationQuery,
  useAddAutomationMutation,
  useEditAutomationMutation,
} = automationApi
