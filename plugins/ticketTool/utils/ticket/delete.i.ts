import { ChatInputCommandInteraction, ButtonInteraction, GuildMember } from 'discord.js'

import { TicketTool, ITicket } from '../../models/ticket-tool.i'

import { isSupport } from '../isSupport.i'

export async function deleteTicket(interaction: ChatInputCommandInteraction | ButtonInteraction) {
  const { channel, guild, member } = interaction

  if (!guild || !channel) {
    return await interaction.reply({
      content: 'You can interact with ticket-tool only from guild channels',
      ephemeral: true,
    })
  }

  if (member && !isSupport(member as GuildMember)) {
    return await interaction.reply({
      content: 'This action is only for support team',
      ephemeral: true,
    })
  }

  const ticket = await TicketTool.findOne<ITicket>({
    guildId: guild.id,
    threadId: channel.id,
  })

  if (!ticket || !ticket.closed) {
    return await interaction.reply({
      content: "Look's like there is no closed ticket's to delete",
      ephemeral: true,
    })
  }

  return await channel.delete()
}
