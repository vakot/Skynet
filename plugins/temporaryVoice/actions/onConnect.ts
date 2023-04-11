import { Events, ChannelType, VoiceState } from 'discord.js'
import { IAction } from '../../../models/action'

const ActiveChannels: string[] = []

export default <IAction>{
  data: {
    name: 'create',
  },
  trigger: Events.VoiceStateUpdate,
  async execute(oldState: VoiceState, newState: VoiceState) {
    // onParentJoin
    if (newState?.channel?.id == '1095278976617959444') {
      return newState.channel.members.map((member) => {
        newState.guild.channels
          .create({
            name: `${member.user.username}'s Room`,
            type: ChannelType.GuildVoice,
            reason: 'temp',
          })
          .then((channel) => {
            member.voice.setChannel(channel)
            ActiveChannels.push(channel.id)
          })
      })
    }

    // onChildLeave
    if (ActiveChannels.includes(oldState?.channel?.id)) {
      if (!oldState.channel.members.size) return oldState.channel.delete()
    }
  },
}
