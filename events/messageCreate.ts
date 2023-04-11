import { Message, Events } from 'discord.js'
import { botClient } from '../src'
import { IMessageCommand } from '../models/command'
import { handleCooldown } from '../utils/cooldownHandler'

module.exports = {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.author.bot) return

    const { messageCommands } = botClient

    if (!messageCommands.has(message.content)) return

    const command: IMessageCommand = messageCommands.get(message.content)

    if (!command) return

    if (handleCooldown(command, message)) return

    try {
      await command.execute(message)
    } catch (error) {
      await message.channel.send({
        content: `Error occured while /${command.data.prefix}${command.data.name} executing`,
      })
      console.error(error)
    }
  },
}

// export default new Event({
//   name: Events.MessageCreate,
//   async execute(message: Message): Promise<void> {
//       // ! Message content is a priviliged intent now!

//       // Handles non-slash commands, only recommended for deploy commands

//       // filters out bots and non-prefixed messages
//       if (!message.content.startsWith(prefix) || message.author.bot) return

//       // fetches the application owner for the bot
//       if (!client.application?.owner) await client.application?.fetch()

//       // get the arguments and the actual command name for the inputted command
//       const args = message.content.slice(prefix.length).trim().split(/ +/)
//       const commandName = (<string>args.shift()).toLowerCase()

//       const command =
//           (client.msgCommands.get(commandName) as MessageCommand) ||
//           (client.msgCommands.find(
//               (cmd: MessageCommand): boolean =>
//                   cmd.aliases && cmd.aliases.includes(commandName)
//           ) as MessageCommand)

//       // dynamic command handling
//       if (!command) return

//       try {
//           await command.execute(message, args)
//       } catch (error) {
//           console.error(error)
//       }
//   },
// })
