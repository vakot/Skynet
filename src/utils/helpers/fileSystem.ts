import fs from 'fs'
import path from 'path'

import logger from './logger'

export function* throughDirectory(directoryPath: string): Generator<string> {
  try {
    const files = fs.readdirSync(directoryPath)

    for (const file of files) {
      const filePath = path.join(directoryPath, file)
      const data = fs.statSync(filePath)

      if (data.isDirectory()) {
        yield* throughDirectory(filePath)
      }

      if (data.isFile()) {
        yield filePath
      }
    }
  } catch (error) {
    logger.error(error)
  }
}

export async function getFiles<T>(
  directoryPath: string,
  type: new (...args: any) => T
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

      if (!(new data.default() instanceof type)) {
        throw ''
      }

      files.push(new data.default())

      logger.log(`File ${fileName} loaded`)
    } catch {
      logger.warn(`File ${fileName} unresolvable`)
    }
  }

  return files
}
