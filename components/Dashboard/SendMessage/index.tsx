import { SendMessageForm } from '@components/Form/SendMessageForm'
import { Card } from 'antd'
import { Guild } from 'discord.js'

export interface SendMessageProps {
  guild?: Guild['id']
}

export const SendMessage: React.FC<SendMessageProps> = ({ guild: guildId }) => {
  return (
    <Card>
      <SendMessageForm guild={guildId} />
    </Card>
  )
}
