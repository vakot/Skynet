import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  User,
} from 'discord.js'

const responder = {
  deny: {
    async reply(
      interaction:
        | ChatInputCommandInteraction
        | ButtonInteraction
        | AnySelectMenuInteraction,
      invalidations: string[],
      actionName?: string
    ) {
      await interaction.reply({
        content: `Access to **${
          actionName ?? 'action'
        }** denied by the following reasons:\n${invalidations
          .map((inv) => `> ${inv}`)
          .join('\n')}`,
        ephemeral: true,
      })
    },

    async dm(user: User, invalidations: string[], actionName?: string) {
      await user
        .send(
          `Access to **${
            actionName ?? 'action'
          }** denied by the following reasons:\n${invalidations
            .map((inv) => `> ${inv}`)
            .join('\n')}\n\nMessage will be deleted <t:${
            Math.round(Date.now() / 1000) + 20
          }:R>`
        )
        .then((message) => setTimeout(() => message.delete(), 20000))
    },
  },
}

export default responder
