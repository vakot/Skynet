import { Events, GuildMember } from 'discord.js'

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member: GuildMember) {
    console.error(member)
  },
}
