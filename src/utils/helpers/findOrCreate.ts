import { Document, Model } from 'mongoose'

export interface IDocument extends Document {
  createdAt: Date
  updatedAt: Date
}

export async function findOrCreate<T extends Model<IDocument>>(
  model: T,
  condition: any,
  defaults: any
): Promise<IDocument> {
  const document = await model.findOne(condition)

  if (document) {
    return document
  } else {
    const newDocument = new model(defaults)
    return newDocument.save()
  }
}
