import path from 'path'

import { Client } from '../../models/client'
import { Category } from '../../models/category'

import { getFiles } from '../helpers/fileSystem'

export async function loadCategories(client: Client): Promise<void> {
  const actionsPath = path.join(__dirname, '..', '..', 'categories')

  const categories = await getFiles(actionsPath, Category)

  categories.forEach((category) =>
    client.categories.set(category.name, category)
  )
}
