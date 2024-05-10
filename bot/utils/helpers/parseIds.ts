import mongoose from 'mongoose'

export function parseIds(ids?: string[]): { objectIds: string[]; globalIds: string[] } {
  const objectIds: string[] = []
  const globalIds: string[] = []

  ids?.forEach((id) => {
    if (mongoose.isValidObjectId(id)) {
      objectIds.push(id)
    } else {
      globalIds.push(id)
    }
  })

  return { objectIds, globalIds }
}
