import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { IMessage } from '@bot/models/message'
import { EditFormItemProps, EditFormProps } from '@components/Form'
import { EditMessageForm } from '@components/Form/EditMessageForm'
import {
  useGetGuildChannelQuery,
  useGetGuildChannelsQuery,
  useGetGuildQuery,
  useGetGuildsQuery,
  useSendGuildChannelMessageMutation,
} from '@modules/api/guild/guild.api'
import { useGetMessageQuery, useGetMessagesQuery } from '@modules/api/message/message.api'
import { Button, Card, Flex, Form, Input, Select, Space } from 'antd'
import { GuildChannel, Guild as IGuild } from 'discord.js'
import { useEffect, useState } from 'react'

export interface SendMessageFormProps extends EditFormProps {
  guild?: IGuild['id']
  channel?: GuildChannel['id']
  message?: IMessage['id']
  onFinish?: (value?: any) => void
}

export const SendMessageForm: React.FC<SendMessageFormProps> = ({
  form: _form,
  guild: guildId,
  channel: channelId,
  message: messageId,
  onFinish,
  onFinishFailed,
  onAbort,
  showControls,
  ...props
}) => {
  const [form] = Form.useForm(_form)

  const { data: guild, isLoading: isGuildLoading } = useGetGuildQuery(guildId, {
    skip: !guildId,
  })
  const { data: channel, isLoading: isChannelLoading } = useGetGuildChannelQuery(
    { id: channelId, guild: guildId },
    { skip: !channelId || !guildId }
  )
  const { data: message, isLoading: isMessageLoading } = useGetMessageQuery(messageId, {
    skip: !messageId,
  })

  const [sendMessage, { isLoading: isSendMessageLoading }] = useSendGuildChannelMessageMutation()

  const isLoading = isGuildLoading || isChannelLoading || isMessageLoading || isSendMessageLoading

  const handleFinish = async (fields: any) => {
    try {
      const response = sendMessage(fields)

      if ('data' in response) {
        onFinish?.(response.data)
      } else if ('error' in response) {
        throw response.error
      }
    } catch (error: any) {
      onFinishFailed?.(error)
    }
  }

  const handleAbort = () => {
    form.resetFields()
    onAbort?.()
  }

  useEffect(() => {
    form.resetFields()
  }, [form, guildId, guild, channelId, channel, messageId, message])

  return (
    <Form
      initialValues={{
        guild: guild?.id,
        channel: channel?.id,
        message: message?._id,
      }}
      onFinish={handleFinish}
      form={form}
      layout="vertical"
      {...props}
    >
      <Guild form={form} disabled={isLoading || (!!guildId && !!guild)} />
      <Channel form={form} disabled={isLoading} />
      <Message form={form} disabled={isLoading} />
      <Send form={form} disabled={isLoading} />

      {showControls && (
        <Flex justify="end" gap={8}>
          <Button type="default" onClick={handleAbort} disabled={isLoading}>
            Discard
          </Button>
          <Button type="primary" onClick={form.submit} disabled={isLoading}>
            Save
          </Button>
        </Flex>
      )}
    </Form>
  )
}

const Guild: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  const { data: guilds, isLoading: isGuildsLoading } = useGetGuildsQuery()

  return (
    <Form.Item
      label="Guild"
      name="guild"
      required
      rules={[{ required: true, message: 'Required' }]}
    >
      <Select
        showSearch
        allowClear
        placeholder="Guild..."
        loading={isGuildsLoading}
        disabled={disabled || isGuildsLoading}
        optionFilterProp="label"
        options={guilds?.map((guild) => ({
          value: guild.id,
          label: guild.name || guild.id,
        }))}
      />
    </Form.Item>
  )
}
const Channel: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  const guildId = Form.useWatch('guild', form)

  const { data: channels, isLoading: isChannelsLoading } = useGetGuildChannelsQuery(guildId)

  return (
    <Form.Item
      label="Channel"
      name="channel"
      required
      rules={[{ required: true, message: 'Required' }]}
    >
      <Select
        showSearch
        allowClear
        placeholder="Channel..."
        loading={isChannelsLoading}
        disabled={disabled || isChannelsLoading}
        optionFilterProp="label"
        options={channels?.map((channel) => ({
          value: channel.id,
          label: channel.name || channel.id,
        }))}
      />
    </Form.Item>
  )
}
const Message: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  const [isNestedFormOpen, setIsNestedFormOpen] = useState<boolean>(false)

  const { data: messages, isLoading: isMessagesLoading } = useGetMessagesQuery()

  const messageId = Form.useWatch('message', form)

  return (
    <Form.Item label="Message" required>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex gap={8}>
          <Form.Item
            style={{ flex: 1 }}
            noStyle
            name="message"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Select
              showSearch
              allowClear
              disabled={disabled || isNestedFormOpen || isMessagesLoading}
              loading={isMessagesLoading}
              optionFilterProp="label"
              options={messages?.map((message) => ({
                value: message._id,
                label: message.name || message._id,
              }))}
              placeholder="Message..."
            />
          </Form.Item>

          <Button
            type="primary"
            onClick={() => setIsNestedFormOpen(true)}
            disabled={disabled || isNestedFormOpen}
          >
            {messageId ? <EditOutlined /> : <PlusOutlined />}
          </Button>
        </Flex>

        {isNestedFormOpen && (
          <Card size="small">
            <EditMessageForm
              message={messageId}
              onFinish={(value) => {
                setIsNestedFormOpen(false)
                form.setFieldValue('message', value?._id)
              }}
              onAbort={() => {
                setIsNestedFormOpen(false)
              }}
              showControls
            />
          </Card>
        )}
      </Space>
    </Form.Item>
  )
}
const Send: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  const webhookUrl = Form.useWatch('webhook', form)

  return (
    <Form.Item label="Send">
      <Flex gap={8}>
        <Form.Item name="webhook" noStyle style={{ flex: 1 }}>
          <Input type="url" placeholder="Webhook URL..." disabled={disabled} />
        </Form.Item>
        <Button disabled={disabled || !webhookUrl} onClick={form.submit}>
          Send as Webhook
        </Button>
        <Button type="primary" disabled={disabled} onClick={form.submit}>
          Send as Skynet
        </Button>
      </Flex>
    </Form.Item>
  )
}
