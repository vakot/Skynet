import { ClientEvents, Events } from 'discord.js'
import { Schema } from './schema'

export interface Action {
  id: string
  data?: any
  event: keyof ClientEvents
  once?: boolean
  deleteble?: boolean
  cooldown?: number
  testOnly?: boolean
  devsOnly?: boolean
  forceUpdate?: boolean
  init(...args: any): any
  execute(...args: any): any
}

export const ActionSchema: Schema<Action> = {
  id: { type: 'string', required: true },
  data: { type: 'any', required: false },
  event: {
    type: (value: string) =>
      (Object.values(Events) as string[]).includes(value),
    required: true,
  },
  once: { type: 'boolean', required: false },
  deleteble: { type: 'boolean', required: false },
  cooldown: { type: 'boolean', required: false },
  testOnly: { type: 'boolean', required: false },
  devsOnly: { type: 'boolean', required: false },
  forceUpdate: { type: 'boolean', required: false },
  init: { type: 'function', required: true },
  execute: { type: 'function', required: true },
}
