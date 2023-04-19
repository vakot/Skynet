import { ClientEvents, Events, VoiceState } from 'discord.js'
import { Action } from '../../models/Action'
import { parentId } from './config.json'
import { childrens } from './create'

export default class TemporaryVoiceDelete extends Action {
  data: { [key: string]: any; name: string } = {
    name: 'temporary-voice-delete',
  }

  event: keyof ClientEvents = Events.VoiceStateUpdate

  async init(oldState: VoiceState, newState: VoiceState): Promise<any> {
    // just in case to be sure
    if (!oldState && !newState) return

    // user streaming is also trigger VoiceStateUpdate. Avoid it
    if (oldState.channelId === newState.channelId) return

    // delete channel only if user leave
    if (!oldState && newState) return

    // don't delete parent channel
    if (oldState.channelId === parentId) return

    // move user back to existing temporary channel
    if (newState.channelId === parentId)
      return await newState.member.voice.setChannel(
        childrens.get(newState.member.id)
      )

    // delete channel only if user have one
    if (!childrens.has(oldState.member.id)) return

    return await this.execute(oldState)
  }

  async execute(oldState: VoiceState): Promise<any> {
    const { channel, member } = oldState

    return await channel.delete().then(() => childrens.delete(member.id))
  }
}
