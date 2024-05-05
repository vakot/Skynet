import { IAction } from '@bot/models/action'
import { SkynetEvents } from '@bot/models/event'
import { IGuild } from '@bot/models/guild'
import { useRouter } from 'next/router'
import React from 'react'
import CommandInteraction from './command-interaction'

export interface ActionProps {
  guild?: IGuild['_id']
  action?: IAction['_id']
}

const Action: React.FC<ActionProps> = ({ guild: guildId, action: actionId }) => {
  const router = useRouter()

  return GuildActions[router.query.type as string]({ guild: guildId, action: actionId })
}

// TODO: proper type
export const GuildActions: Record<string, React.FC<ActionProps>> = {
  [SkynetEvents.CommandInteraction]: CommandInteraction,
}

export default Action
