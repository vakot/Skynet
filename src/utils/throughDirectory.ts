import fs from 'fs'
import path from 'path'

export function* throughDirectory(directoryPath: string): Generator<string> {
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
}
