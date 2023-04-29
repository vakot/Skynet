import { Model } from 'mongoose'

import { IDocument } from '../../models/document'

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
