import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  GetCategoriesRequest,
  GetCategoriesResponse,
  GetCategoryRequest,
  GetCategoryResponse,
  PatchCategoryRequest,
  PatchCategoryResponse,
  PostCategoryRequest,
  PostCategoryResponse,
} from './category.api.types'

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['Category', 'Action'],
  baseQuery: fetchBaseQuery({ baseUrl: `/api/` }),
  endpoints: (builder) => ({
    getCategories: builder.query<GetCategoriesResponse, GetCategoriesRequest>({
      query: (query) => ({
        url: `category`,
        method: 'GET',
        ...(!!query && { params: query }),
      }),
      providesTags: ['Category'],
    }),
    getCategory: builder.query<GetCategoryResponse, GetCategoryRequest>({
      query: (id) => ({
        url: `category/${id}`,
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),
    addCategory: builder.mutation<PostCategoryResponse, PostCategoryRequest>({
      query: (body) => ({
        url: `category`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Category', 'Action'],
    }),
    editCategory: builder.mutation<PatchCategoryResponse, PatchCategoryRequest>({
      query: ({ id, ...body }) => ({
        url: `category/${id}`,
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
