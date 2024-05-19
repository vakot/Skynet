import { EditMessageComponentForm } from '@components/Form/EditMessageForm/EditComponentForm'
import { ComponentsList } from '@components/List/MessagesList/ComponentsList'
import { Button, Card, Form, Modal } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface MessageComponentsProps {
  guild?: Guild['id']
}

export const MessageComponents: React.FC<MessageComponentsProps> = ({ guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <Card>
      <ComponentsList
        guild={guildId}
        header={
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Add new Component
          </Button>
        }
      />

      <Modal
        title="Create message component"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
        }}
        destroyOnClose
      >
        <EditMessageComponentForm form={form} onFinish={() => setIsModalOpen(false)} />
      </Modal>
    </Card>
  )
}
