import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Collection,
  EmbedBuilder,
  User,
} from 'discord.js'

const responder = {
  deny: {
    async reply(
      interaction:
        | ChatInputCommandInteraction
        | ButtonInteraction
        | AnySelectMenuInteraction,
      invalidations: Collection<string, string[]>,
      actionName?: string
    ) {
      const embed = DenyEmbed(invalidations)

      embed.setTitle(`Access to <${actionName ?? 'action'}> denied`)

      return await interaction
        .reply({ embeds: [embed], ephemeral: true })
        .then((message) => setTimeout(() => message.delete(), 20000))
    },

    async dm(
      user: User,
      invalidations: Collection<string, string[]>,
      actionName?: string
    ) {
      const embed = DenyEmbed(invalidations)

      embed.setTitle(`Access to <${actionName ?? 'action'}> denied`)

      await user
        .send({ embeds: [embed] })
        .then((message) => setTimeout(() => message.delete(), 20000))
    },
  },
}

function DenyEmbed(invalidations: Collection<string, string[]>): EmbedBuilder {
  const embed = new EmbedBuilder()

  for (const invalidation of invalidations) {
    const key = invalidation[0]
    const value = invalidation[1]

    embed.addFields({
      name: key,
      value: value.map((reason) => `> ${reason}`).join('\n'),
    })
  }

  return embed.setDescription('Message will be automatically deleted in `20s`')
}

export default responder
