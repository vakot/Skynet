import { Events, GuildMember } from 'discord.js'

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    console.error(member)
  },
}
