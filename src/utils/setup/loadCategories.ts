import path from 'path'

import { Client } from '../../modules/models/client'
import { Category } from '../../modules/models/category'

import { getFiles } from '../helpers/fileSystem'

export async function loadCategories(client: Client): Promise<void> {
  const categoriesPath = path.join(__dirname, '..', '..', 'categories')

  const categories = await getFiles(categoriesPath, Category)

  categories.forEach((category) =>
    client.categories.set(category.name, category)
  )
}
