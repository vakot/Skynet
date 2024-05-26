import { SkynetEvents } from '@bot/models/event'
import { AutomationItemProps } from '@components/Automations/command-interaction'
import { useGetGuildChannelsQuery } from '@modules/api/guild/guild.api'
import { Form, Input, Select, Space } from 'antd'

export const SendMessageAction: React.FC<AutomationItemProps> = ({
  form,
  guild: guildId,
  name,
}) => {
  const { data: channels, isLoading: isChannelsLoading } = useGetGuildChannelsQuery(guildId, {
    skip: !guildId,
  })

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Form.Item label="Channel" name={[name, 'value', 'channels']} style={{ margin: 0 }}>
        <Select
          allowClear
          showSearch
          mode="multiple"
          optionFilterProp="label"
          loading={isChannelsLoading}
          disabled={isChannelsLoading}
          placeholder="Guild channel..."
          options={channels?.map((channel) => ({
            value: channel.id,
            label: channel.name,
          }))}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item label="Content" name={[name, 'value', 'message', 'content']} style={{ margin: 0 }}>
        <Input.TextArea rows={3} placeholder="Content..." />
      </Form.Item>
    </Space>
  )
}

export const sendMessageActionDefault = {
  event: SkynetEvents.CommandInteraction,
  type: 'sendMessage',
  value: {
    channels: [],
    message: {
      content: 'Hello, Skynet!',
    },
  },
}
