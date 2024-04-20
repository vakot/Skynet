import { IEvent } from '@bot/models/event'
import { AnySelectMenuInteraction, Events } from 'discord.js'

export default {
  type: Events.InteractionCreate,
  once: true,
  async init(client, interaction: AnySelectMenuInteraction) {
    if (!interaction.isAnySelectMenu()) {
      return
    }

    return interaction.reply({
      content: ['```typescript', '// TODO: AnySelectMenuInteraction', '```'].join('\n'),
      ephemeral: true,
    })
  },
} as IEvent
