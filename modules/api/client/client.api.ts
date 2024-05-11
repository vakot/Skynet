import { GetClientRequest, GetClientResponse } from '@modules/api/client/client.api.types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const clientApi = createApi({
  reducerPath: 'clientApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['Client'],
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getClient: builder.query<GetClientResponse, GetClientRequest>({
      query: () => 'client',
      providesTags: ['Client'],
    }),
  }),
})

export const { useGetClientQuery } = clientApi
