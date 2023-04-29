export interface ICategory {
  name: string
  description?: string
  emoji?: string
}

export function getCategoryName(category: ICategory): string {
  const name = []
  if (category.emoji) name.push(category.emoji)
  name.push(category.name)
  return name.join('・')
}

export const ActionCategories = {
  General: {
    name: 'General',
    description: 'general_description',
  } as ICategory,

  Utils: {
    name: 'Utilities',
    description: 'utilities_description',
  } as ICategory,

  Moderation: {
    name: 'Moderation',
    description: 'mod_description',
  } as ICategory,

  Fun: {
    name: 'Fun',
    description: 'fun_description',
  } as ICategory,

  Test: {
    name: 'Test',
    description: 'test_description',
  } as ICategory,
}
