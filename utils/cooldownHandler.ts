import { Collection, User } from 'discord.js'
import { skynet } from '../src'

export function isInCooldown(interaction): Boolean {
  const { actions, cooldowns } = skynet

  const componentKey = interaction.customId || interaction.commandName

  if (!cooldowns.has(componentKey)) {
    cooldowns.set(componentKey, new Collection())
  }

  const action = actions.get(componentKey).data

  if (!action.cooldown) return false

  const now = Date.now()
  const timestamps = cooldowns.get(action.name)

  const user: User = interaction.member.user

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
