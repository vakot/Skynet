import { ICategory } from '../models/category'

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
