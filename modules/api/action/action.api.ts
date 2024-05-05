import { IAction } from '@bot/models/action'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const actionApi = createApi({
  reducerPath: 'actionApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getActions: builder.query<IAction[], string[] | string | undefined | void>({
      query: (ids) => ({
        url: 'action',
        method: 'GET',
        params: { ids },
      }),
    }),
    getActionById: builder.query<IAction, string | undefined>({
      query: (id) => ({
        url: `action/${id}`,
        method: 'GET',
      }),
    }),
    postAction: builder.mutation<IAction, Partial<IAction>>({
      query: ({ id, ...body }) => ({
        url: `action/${id}`,
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useGetActionsQuery, useGetActionByIdQuery, usePostActionMutation } = actionApi
