import { BugFilled } from '@ant-design/icons'
import {
  SendMessageAction,
  sendMessageActionDefault,
} from '@components/Automations/command-interaction/SendMessageAction'
import { FormInstance } from 'antd'
import { Guild } from 'discord.js'
import { IsCommandCondition, isCommandConditionDefault } from './IsCommandCondition'
import { ReplyAction, replyActionDefault } from './ReplyAction'

export interface AutomationItemProps {
  form?: FormInstance
  guild?: Guild['id']
  name?: any
}

export const CommandInteractionActions = {
  reply: {
    description: 'Reply to interaction',
    icon: <BugFilled />,
    component: ReplyAction,
    default: replyActionDefault,
  },
  sendMessage: {
    description: 'Sends message to specific channels',
    icon: <BugFilled />,
    component: SendMessageAction,
    default: sendMessageActionDefault,
  },
}

export const CommandInteractionConditions = {
  isCommand: {
    description: 'Specified /command',
    icon: <BugFilled />,
    component: IsCommandCondition,
    default: isCommandConditionDefault,
  },
}
