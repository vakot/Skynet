import { Collection, Snowflake, User } from 'discord.js'

const cooldowns = new Collection<string, Collection<Snowflake, number>>()

export default function (key: string, cooldown: number, interaction: any): Boolean {
  if (!cooldowns.has(key)) {
    cooldowns.set(key, new Collection())
  }

  if (!cooldown) return false

  const now = Date.now()
  const timestamps = cooldowns.get(key)

  const user: User = interaction.member.user

  // not in cooldown
  if (!timestamps.has(user.id)) {
    // set cooldown
    timestamps.set(user.id, now)
    setTimeout(() => timestamps.delete(user.id), cooldown)

    return false
  }

  const expirationTime = timestamps.get(user.id) + cooldown

  // in cooldown
  if (now < expirationTime) {
    const cooldown = Math.ceil((expirationTime - now) / 1000)

    interaction.reply({ content: `Cooldown in ${cooldown}s`, ephemeral: true })

    return true
  }

  return true
}
