import { ButtonBuilder, SelectMenuBuilder } from 'discord.js'

export interface IComponentData {
  options: [
    {
      name: string
      value: string
    }
  ]
  name: string
  name_localizations?: string[]
  description: string
  description_localizations?: string[]
  default_permission?: string
  default_member_permissions?: string
  dm_permission?: string
  nsfw?: boolean
}

export interface IComponent {
  data: SelectMenuBuilder | ButtonBuilder
  cooldown?: number
  testOnly?: boolean
  devsOnly?: boolean
  callback(...args: any): any
}
