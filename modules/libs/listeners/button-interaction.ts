import { IEvent } from '@models/event'
import { ButtonInteraction, Events } from 'discord.js'

export default {
  type: Events.InteractionCreate,
  once: true,
  async init(client, interaction: ButtonInteraction) {
    if (!interaction.isButton()) {
      return
    }

    return interaction.reply({
      content: ['```typescript', '// TODO: ButtonInteraction', '```'].join('\n'),
      ephemeral: true,
    })
  },
} as IEvent
