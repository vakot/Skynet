import { EditMessageForm } from '@components/Form/EditMessageForm'
import { MessagesList } from '@components/List/MessagesList'
import { Button, Card, Form, Modal } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface MessagesProps {
  guild?: Guild['id']
}

export const Messages: React.FC<MessagesProps> = ({ guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <Card>
      <MessagesList
        guild={guildId}
        header={
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Add new message template
          </Button>
        }
      />

      <Modal
        title="Create message template"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
        }}
        destroyOnClose
      >
        <EditMessageForm form={form} onFinish={() => setIsModalOpen(false)} />
      </Modal>
    </Card>
  )
}
