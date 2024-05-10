import {
  GetCategoriesRequest,
  GetCategoriesResponse,
  GetCategoryRequest,
  GetCategoryResponse,
  PatchCategoryRequest,
  PatchCategoryResponse,
  PostCategoryRequest,
  PostCategoryResponse,
} from '@modules/api/action-category/action-category.api.types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['Category', 'Action'],
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getCategories: builder.query<GetCategoriesResponse, GetCategoriesRequest>({
      query: (query) => ({
        url: `action-category`,
        method: 'GET',
        ...(!!query && { query }),
      }),
      providesTags: ['Category'],
    }),
    getCategory: builder.query<GetCategoryResponse, GetCategoryRequest>({
      query: (id) => ({
        url: `action-category/${id}`,
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),
    addCategory: builder.mutation<PostCategoryResponse, PostCategoryRequest>({
      query: (body) => ({
        url: `action-category`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Category', 'Action'],
    }),
    editCategory: builder.mutation<PatchCategoryResponse, PatchCategoryRequest>({
      query: ({ id, ...body }) => ({
        url: `action-category/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Category', 'Action'],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useAddCategoryMutation,
  useEditCategoryMutation,
} = categoryApi
