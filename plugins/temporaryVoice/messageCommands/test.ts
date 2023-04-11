import { Message } from 'discord.js'
import { IMessageCommand } from '../../../models/command'

export default <IMessageCommand>{
  data: {
    name: 'test',
    prefix: 'v!',
  },

  cooldown: 300,

  async execute(message: Message) {
    message.channel.send('Pending...')
  },
}
