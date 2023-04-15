import { Collection, Snowflake, User } from 'discord.js'
import store from './store'
import { ICommand } from '../models/command'
import { IComponent } from '../models/component'

const cooldowns = new Collection<string, Collection<Snowflake, number>>()

export function isInteractionCooldown(interaction): Boolean {
  const component = ((): { key: string; value: ICommand | IComponent } => {
    if (interaction.isChatInputCommand()) {
      const key = interaction.commandName
      const command = store
        .get('localCommands')
        .find((cmd) => cmd.data.name === key)

      return { key: key, value: command }
    }

    if (interaction.isAnySelectMenu() || interaction.isButton()) {
      const key = interaction.customId
      const component = store
        .get('components')
        .find((cmp) => cmp.data.name === key)
      return { key: key, value: component }
    }
  })()

  if (!cooldowns.has(component.key)) {
    cooldowns.set(component.key, new Collection())
  }

  if (!component.value.cooldown) return false

  const now = Date.now()
  const timestamps = cooldowns.get(component.key)

  const user: User = interaction.member.user

  // not in cooldown
  if (!timestamps.has(user.id)) {
    // set cooldown
    timestamps.set(user.id, now)
    setTimeout(() => timestamps.delete(user.id), component.value.cooldown)

    return false
  }

  const expirationTime = timestamps.get(user.id) + component.value.cooldown

  // in cooldown
  if (now < expirationTime) {
    const cooldown = Math.ceil((expirationTime - now) / 1000)

    interaction.reply({ content: `Cooldown in ${cooldown}s`, ephemeral: true })

    return true
  }

  return true
}
