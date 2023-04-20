import fs from 'fs'
import path from 'path'

import logger from './logger'

/**
 * function recursively read all files in provided directory
 * and it's subdirectories and returns paths of readed files
 *
 * @param {string} directoryPath - path to directory
 * @returns {Generator<string>} - yielded paths
 */
export function* throughDirectory(directoryPath: string): Generator<string> {
  try {
    const files = fs.readdirSync(directoryPath)

    for (const file of files) {
      const filePath = path.join(directoryPath, file)
      const data = fs.statSync(filePath)
      // if directory - go deeper in recursion
      if (data.isDirectory()) {
        yield* throughDirectory(filePath)
      }
      // if file - return path
      if (data.isFile()) {
        yield filePath
      }
    }
  } catch (error) {
    logger.error(error)
  }
}

/**
 * function read files in directory and it's subdirecoties
 * than compare result to provided type paramether
 * and returns array of class instances
 *
 * @param {string} directoryPath - path to directory
 * @param {new (...args: any) => T} targetClass - class to compare with file
 * @returns {Promise<T[]>} - array of compareClass instances
 */
export async function getFiles<T>(
  directoryPath: string,
  targetClass: new (...args: any) => T
): Promise<T[]> {
  const files: T[] = []

  for (const filePath of throughDirectory(directoryPath)) {
    // regex before pop() just to be sure that all paths have same format
    const fileName = filePath.replace(/\\/g, '/').split('/').pop()

    // ignore all non .js and non .ts files
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.js')) {
      logger.info(`File <${fileName}> ignored`)
      continue
    }

    try {
      // read
      const data = await import(filePath)
      // check
      if (!(data.default instanceof targetClass)) throw ''
      // save
      files.push(data.default)
      logger.log(`File <${fileName}> loaded`)
    } catch {
      logger.warn(`File <${fileName}> unresolvable`)
    }
  }

  return files
}
