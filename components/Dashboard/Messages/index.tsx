import { EditMessageForm } from '@components/Form/EditMessageForm'
import { MessagesList } from '@components/List/MessagesList'
import { useGetMessagesQuery } from '@modules/api/message/message.api'
import { Button, Card, Form, Modal, Space } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface MessagesProps {
  guild?: Guild['id']
}

export const Messages: React.FC<MessagesProps> = ({ guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  const { data: messages, isLoading: isMessagesLoading } = useGetMessagesQuery()

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button
            type="primary"
            onClick={() => {
              setSelectedId(undefined)
              setIsModalOpen(true)
            }}
          >
            Add new message
          </Button>

          <MessagesList
            data={messages}
            loading={isMessagesLoading}
            onSelect={(message) => {
              setSelectedId(message._id)
              setIsModalOpen(true)
            }}
          />

          <Modal
            title={selectedId ? 'Edit message template' : 'Create message template'}
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={() => {
              form.resetFields()
              setSelectedId(undefined)
              setIsModalOpen(false)
            }}
          >
            <EditMessageForm
              form={form}
              message={selectedId}
              onFinish={() => {
                setSelectedId(undefined)
                setIsModalOpen(false)
              }}
            />
          </Modal>
        </Space>
      </Card>
    </Space>
  )
}
