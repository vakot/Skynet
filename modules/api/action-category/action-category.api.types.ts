import { ICategory } from '@bot/models/category'

export type GetCategoriesRequest = {
  ids?: string[]
} | void
export type GetCategoriesResponse = ICategory[]

export type GetCategoryRequest = string | undefined | void

export type GetCategoryResponse = ICategory

export type PostCategoryRequest = Omit<ICategory, '_id'>
export type PostCategoryResponse = ICategory

export type PatchCategoryRequest = {
  id?: string
} & Omit<ICategory, '_id'>
export type PatchCategoryResponse = ICategory
