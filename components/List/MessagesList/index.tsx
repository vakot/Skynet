import { BugOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { IMessage } from '@bot/models/message'
import { EditMessageForm } from '@components/Form/EditMessageForm'
import { useGetMessagesQuery } from '@modules/api/message/message.api'
import { Button, Empty, Form, List, ListProps, Modal, Space } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface MessagesListProps extends Omit<ListProps<IMessage>, 'dataSource'> {
  guild?: Guild['id']
}

export const MessagesList: React.FC<MessagesListProps> = ({
  guild: guildId,
  loading,
  ...props
}) => {
  const { data: messages, isLoading: isMessagesLoading } = useGetMessagesQuery()

  return (
    <List loading={loading || isMessagesLoading} {...props}>
      {messages?.map((message) => (
        <MessagesListItem key={message._id} message={message} guild={guildId} />
      )) || (!isMessagesLoading ? <Empty /> : null)}
    </List>
  )
}

export interface MessagesListItemProps {
  message: IMessage
  guild: MessagesListProps['guild']
}

export const MessagesListItem: React.FC<MessagesListItemProps> = ({ message, guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<BugOutlined />}
        title={message.name || message._id}
        description={message.description}
      />

      <Space>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          <EditOutlined />
        </Button>
        <Button
          danger
          onClick={() => {
            // TODO: delete
          }}
        >
          <DeleteOutlined />
        </Button>
      </Space>

      <Modal
        title="Edit message template"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
        }}
        destroyOnClose
      >
        <EditMessageForm form={form} message={message._id} onFinish={() => setIsModalOpen(false)} />
      </Modal>
    </List.Item>
  )
}
