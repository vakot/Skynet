import fs from 'fs'
import path from 'path'

import logger from './logger'

/**
 * Recursively read all files in provided directory and
 * it's subdirectories and returns it's paths
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
 * Read files in directory and it's subdirecoties
 * than compare result to provided type paramether
 * and returns array of class instances
 *
 * @param {string} directoryPath - path to directory
 * @param {new (...args: any) => T} compareClass - class to compare with file
 * @returns {Promise<T[]>} - array of compareClass instances
 */
export async function getFiles<T>(
  directoryPath: string,
  compareClass: new (...args: any) => T
): Promise<T[]> {
  const files: T[] = []

  for (const filePath of throughDirectory(directoryPath)) {
    // just to be shure that all paths have same separator
    const fileName = filePath.replace(/\\/g, '/').split('/').pop()
    // ignore all non .js and non .ts files
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.js')) {
      logger.info(`File ${fileName} ignored`)
      continue
    }
    try {
      const data = await import(filePath)
      // get only files of provided class
      if (!(new data.default() instanceof compareClass)) {
        throw ''
      }
      // create instance and save
      files.push(new data.default())
      logger.log(`File ${fileName} loaded`)
    } catch {
      // same error message for any purpose
      // data.default is not a class
      // data.default is not a provided class
      // other possible errors...
      logger.warn(`File ${fileName} unresolvable`)
    }
  }

  return files
}
