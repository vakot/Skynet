import fs from 'fs'
import path from 'path'

/**
 * Recursively read all files in provided directory and it's
 * subdirectories and returns paths of readed files
 *
 * @param {string} directoryPath path to directory
 * @returns {Generator<string>} yielded paths
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
    console.error(error)
  }
}

/**
 * Search instances of default exports
 * on directory and it's subdirectories
 *
 * @param {string} directoryPath path to directory
 * @returns {Generator<{data:T; path:string}>} yielded files defaults
 */
export function* getFiles<T>(directoryPath: string): Generator<{ data: T; path: string }> {
  for (const filePath of throughDirectory(directoryPath)) {
    try {
      if (!filePath.endsWith('.ts') && !filePath.endsWith('.js')) {
        continue
      }

      const data = require(filePath).default

      if (data) {
        yield { data, path: path.relative(directoryPath, filePath).replace('\\', '/') }
      }
    } catch (error) {
      console.error(error)
    }
  }
}
