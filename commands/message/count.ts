import { Message } from 'discord.js'
import { IMessageCommand } from '../../models/command'

export default <IMessageCommand>{
  data: {
    name: 'count',
    prefix: 'g!',
  },

  cooldown: 30000,

  async execute(message: Message) {
    message.channel.send('Pending...')
  },
}
