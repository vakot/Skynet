import fs from 'fs'
import path from 'path'

import { compareObjectWithSchema } from './compareObjectWithSchema'

import logger from './logger'

export function* throughDirectory(directoryPath: string): Generator<string> {
  try {
    const files = fs.readdirSync(directoryPath)

    for (const file of files) {
      const filePath = path.join(directoryPath, file)
      const stats = fs.statSync(filePath)

      if (stats.isDirectory()) {
        yield* throughDirectory(filePath)
      }

      if (stats.isFile()) {
        yield filePath
      }
    }
  } catch (error) {
    logger.error(error)
  }
}

export async function getFiles<T>(
  directoryPath: string,
  schema: object
): Promise<T[]> {
  const files: T[] = []

  for (const filePath of throughDirectory(directoryPath)) {
    const fileName = filePath.replace(/\\/g, '/').split('/').pop()

    if (!filePath.endsWith('.ts') && !filePath.endsWith('.js')) {
      logger.info(`File ${fileName} ignored`)
      continue
    }

    try {
      const data = await import(filePath)

      if (!compareObjectWithSchema(data.default, schema))
        throw `File ${fileName} unresolvable`

      files.push(data.default)

      logger.log(`File ${fileName} loaded`)
    } catch (error) {
      logger.error(error)
    }
  }

  return files
}
