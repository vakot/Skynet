import { ICategory } from '@modules/models/category'

export function getCategoryName(category: ICategory): string {
  const name = []
  if (category.emoji) name.push(category.emoji)
  name.push(category.name)
  return name.join('・')
}
