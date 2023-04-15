import { Collection, Interaction, Snowflake, User } from 'discord.js'
import { IAction } from '../../models/action'

const cooldowns = new Collection<string, Collection<Snowflake, number>>()

export default function (action: IAction, interaction: Interaction): Boolean {
  if (
    !interaction.isChatInputCommand() &&
    !interaction.isButton() &&
    !interaction.isAnySelectMenu()
  )
    return false

  const key = interaction.isChatInputCommand()
    ? interaction.commandName
    : interaction.customId

  if (!cooldowns.has(key)) {
    cooldowns.set(key, new Collection())
  }

  if (!action.cooldown) return false

  const now = Date.now()
  const timestamps = cooldowns.get(key)

  const user: User = interaction.user

  // not in cooldown
  if (!timestamps.has(user.id)) {
    // set cooldown
    timestamps.set(user.id, now)
    setTimeout(() => timestamps.delete(user.id), action.cooldown)

    return false
  }

  const expirationTime = timestamps.get(user.id) + action.cooldown

  // in cooldown
  if (now < expirationTime) {
    const cooldown = Math.ceil((expirationTime - now) / 1000)

    interaction.reply({ content: `Cooldown in ${cooldown}s`, ephemeral: true })

    return true
  }

  return true
}
