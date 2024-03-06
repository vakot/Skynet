import { ICategory } from '@modules/models/category'

export const ActionCategories = {
  General: {
    name: 'General',
    description: 'Default commands group to make some fun, some utils and other aspects possible',
    emoji: '📢',
  } as ICategory,

  Utils: {
    name: 'Utilities',
    description:
      'Restricted accessed actions to modify server settings, users settings, channels settings and other',
    emoji: '⚙️',
  } as ICategory,

  Moderation: {
    name: 'Moderation',
    description: 'Group of moderation actions and configuration',
    emoji: '🛡',
  } as ICategory,

  Fun: {
    name: 'Fun',
    description: 'Fun making commands for memes',
  } as ICategory,

  Test: {
    name: 'Testing',
    description:
      'Restricted accessed actions to test some features or test is actions working correctly',
    emoji: '🔒',
  } as ICategory,

  About: {
    name: 'About',
    description: 'Group of actions that descibe all or separated aspects of bot',
    emoji: '❓',
  } as ICategory,
}
