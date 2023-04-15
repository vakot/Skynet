import { ButtonBuilder, SelectMenuBuilder } from 'discord.js'

export interface IComponent {
  data: SelectMenuBuilder | ButtonBuilder
  cooldown?: number
  testOnly?: boolean
  devsOnly?: boolean
  callback(...args: any): any
}
