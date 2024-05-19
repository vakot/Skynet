import { BugOutlined, DeleteOutlined, EditOutlined, SendOutlined } from '@ant-design/icons'
import { IMessage } from '@bot/models/message'
import { EditMessageForm } from '@components/Form/EditMessageForm'
import { SendMessageForm } from '@components/Form/SendMessageForm'
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
  const [editForm] = Form.useForm()
  const [sendForm] = Form.useForm()

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isSendModalOpen, setIsSendModalOpen] = useState<boolean>(false)

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<BugOutlined />}
        title={message.name || message._id}
        description={message.description}
      />

      <Space>
        <Button type="primary" onClick={() => setIsSendModalOpen(true)}>
          <SendOutlined />
        </Button>
        <Button type="primary" onClick={() => setIsEditModalOpen(true)}>
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
        title="Send message"
        open={isSendModalOpen}
        onOk={() => sendForm.submit()}
        onCancel={() => {
          sendForm.resetFields()
          setIsSendModalOpen(false)
        }}
        destroyOnClose
      >
        <SendMessageForm
          form={sendForm}
          message={message._id}
          guild={guildId}
          onFinish={() => setIsSendModalOpen(false)}
        />
      </Modal>

      <Modal
        title="Edit message template"
        open={isEditModalOpen}
        onOk={() => editForm.submit()}
        onCancel={() => {
          editForm.resetFields()
          setIsEditModalOpen(false)
        }}
        destroyOnClose
      >
        <EditMessageForm
          form={editForm}
          message={message._id}
          onFinish={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </List.Item>
  )
}
