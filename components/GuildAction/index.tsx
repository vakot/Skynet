import { IAction } from '@bot/models/action'
import { SkynetEvents } from '@bot/models/event'
import { IGuild } from '@bot/models/guild'
import CommandInteraction from './CommandInteraction'
import MessageCreate from './MessageCreate'
import styles from './style.module.scss'

export interface GuildActionProps {
  guild: IGuild['_id']
  action: IAction['_id']
}

const GuildAction: React.FC<GuildActionProps & { type: SkynetEvents | string }> = ({
  guild: guildId,
  action: actionId,
  type,
}) => {
  if (type in guildActions) {
    return (
      <div className={styles.GuildAction}>
        {guildActions[type]({ guild: guildId, action: actionId })}
      </div>
    )
  }
}

// TODO: proper type
export const guildActions: Record<string, React.FC<GuildActionProps>> = {
  [SkynetEvents.CommandInteraction]: CommandInteraction,
  [SkynetEvents.MessageCreate]: MessageCreate,
}

export default GuildAction
