import fs from 'fs'
import path from 'path'

import logger from '@utils/helpers/logger'

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
      const stats = fs.statSync(filePath)

      // if directory - go deeper in recursion
      if (stats.isDirectory()) {
        yield* throughDirectory(filePath)
      }
      // if file - return path
      if (stats.isFile()) {
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
    const rootPath = path.join(__dirname, '..', '..')
    const relativePath = filePath.replace(rootPath, '')

    // ignore all non .js and non .ts files and files marked to ignore
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.js')) continue
    if (filePath.includes('.ignore.') || filePath.includes('.i.')) continue

    const fileSize = (fs.statSync(filePath).size / 1024).toFixed(2)

    try {
      // read
      const data = await import(filePath)
      // check
      if (!(data.default instanceof targetClass)) {
        throw 'Class instance is missing in export default'
      }
      // save
      files.push(data.default)
      logger.status.ok(`[${fileSize}Kb] ${relativePath}`)
    } catch (e) {
      logger.status.failed(`[${fileSize}Kb] ${relativePath}`, e)
    }
  }

  return files
}
