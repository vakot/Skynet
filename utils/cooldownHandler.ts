import { BaseInteraction, Collection, Message, User } from 'discord.js'
import { skynet } from '../src'

function isMessage(instance): Boolean {
  return instance instanceof Message
}

function isInteraction(instance): Boolean {
  return (
    instance instanceof BaseInteraction &&
    (instance.isChatInputCommand() ||
      instance.isButton() ||
      instance.isAnySelectMenu())
  )
}

export function handleCooldown(component, userInput): Boolean {
  const { cooldowns } = skynet

  if (!cooldowns.has(component.data.name)) {
    cooldowns.set(component.data.name, new Collection())
  }

  if (!component.cooldown) return false

  const now = Date.now()
  const timestamps = cooldowns.get(component.data.name)

  const user: User = userInput.member.user

  // if NOT in cooldown
  if (!timestamps.has(user.id)) {
    // set cooldown
    timestamps.set(user.id, now)
    setTimeout(() => timestamps.delete(user.id), component.cooldown)

    return false
  }

  const expirationTime = timestamps.get(user.id) + component.cooldown

  // if in cooldown
  if (now < expirationTime) {
    const cooldown = Math.ceil((expirationTime - now) / 1000)

    if (isInteraction(userInput)) {
      userInput.reply(`Cooldown in ${cooldown}s`)
    }

    if (isMessage(userInput)) {
      userInput.channel.send(`Cooldown in ${cooldown}s`)
    }

    return true
  }
}
