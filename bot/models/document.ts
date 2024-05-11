import { Document } from 'mongoose'

export interface IDocument<T = any, TQueryHelpers = any, DocType = any>
  extends Document<T, TQueryHelpers, DocType> {
  createdAt: Date
  updatedAt: Date
}
