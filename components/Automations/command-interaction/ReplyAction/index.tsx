import { SkynetEvents } from '@bot/models/event'
import { AutomationItemProps } from '@components/Automations/command-interaction'
import { Form, Input, Space, Switch } from 'antd'

export const ReplyAction: React.FC<AutomationItemProps> = ({ form, guild: guildId, name }) => {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Form.Item label="Ephemeral" name={[name, 'value', 'ephemeral']} style={{ margin: 0 }}>
        <Switch />
      </Form.Item>

      <Form.Item label="Content" name={[name, 'value', 'message', 'content']} style={{ margin: 0 }}>
        <Input.TextArea rows={3} placeholder="Content..." />
      </Form.Item>
    </Space>
  )
}

export const replyActionDefault = {
  event: SkynetEvents.CommandInteraction,
  type: 'reply',
  value: {
    ephemeral: false,
    message: {
      content: 'Hello, Skynet!',
    },
  },
}
