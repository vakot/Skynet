import { Message } from 'discord.js'
import { IMessageCommand } from '../models/command'
import { botClient } from '../src'

export default <IMessageCommand>{
  data: {
    name: 'count',
  },

  cooldown: 300,

  async execute(message: Message) {
    console.log(botClient.prefix)

    return
    // if (message.author.bot || !message.content.startsWith(this.preffix)) return

    return await message.channel.send(message.content)
  },
}
