import { BaseInteraction, Collection, Message } from 'discord.js'
import { botClient } from '../src'

async function replyWith(message, interaction) {
  return await interaction.reply({
    content: message,
    ephemeral: true,
  })
}

// export function handleCooldown(component, interaction: Interaction): Boolean {
//   const { cooldowns } = botClient

//   // Command in cooldown for specific user
//   if (!cooldowns.has(component.data.name)) {
//     cooldowns.set(component.data.name, new Collection())
//   }

//   // Cooldown logic
//   if (component.cooldown) {
//     const now = Date.now()
//     const timestamps = cooldowns.get(component.data.name)

//     if (timestamps.has(interaction.user.id)) {
//       const expirationTime =
//         timestamps.get(interaction.user.id) + component.cooldown

//       if (now < expirationTime) {
//         replyWith(
//           `In cooldown for ${Math.round((expirationTime - now) / 1000)}s`,
//           interaction
//         )

//         return true
//       }
//     }

//     timestamps.set(interaction.user.id, now)
//     setTimeout(() => timestamps.delete(interaction.user.id), component.cooldown)
//   }

//   return false
// }

export function handleCooldown(component, userInput): Boolean {
  const { cooldowns } = botClient

  if (userInput instanceof Message) {
    if (!cooldowns.has(component.data.name)) {
      cooldowns.set(component.data.name, new Collection())
    }

    // Cooldown logic
    if (component.cooldown) {
      const now = Date.now()
      const timestamps = cooldowns.get(component.data.name)

      if (timestamps.has(userInput.author.id)) {
        const expirationTime =
          timestamps.get(userInput.author.id) + component.cooldown

        if (now < expirationTime) {
          userInput.channel.send(
            `In cooldown for ${Math.round((expirationTime - now) / 1000)}s`
          )

          return true
        }
      }

      timestamps.set(userInput.author.id, now)
      setTimeout(
        () => timestamps.delete(userInput.author.id),
        component.cooldown
      )
    }

    return false
  }

  if (
    userInput instanceof BaseInteraction &&
    (userInput.isChatInputCommand() ||
      userInput.isButton() ||
      userInput.isAnySelectMenu())
  ) {
    if (!cooldowns.has(component.data.name)) {
      cooldowns.set(component.data.name, new Collection())
    }

    // Cooldown logic
    if (component.cooldown) {
      const now = Date.now()
      const timestamps = cooldowns.get(component.data.name)

      if (timestamps.has(userInput.user.id)) {
        const expirationTime =
          timestamps.get(userInput.user.id) + component.cooldown

        if (now < expirationTime) {
          userInput.reply(
            `In cooldown for ${Math.round((expirationTime - now) / 1000)}s`
          )

          return true
        }
      }

      timestamps.set(userInput.user.id, now)
      setTimeout(() => timestamps.delete(userInput.user.id), component.cooldown)
    }

    return false
  }
}
