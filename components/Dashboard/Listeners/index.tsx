import { EditListenerForm } from '@components/Form/EditListenerForm'
import { ListenersList } from '@components/List/ListenersList'
import { Button, Card, Form, Modal } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface ListenersProps {
  guild?: Guild['id']
}

export const Listeners: React.FC<ListenersProps> = ({ guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <Card>
      <ListenersList
        guild={guildId}
        header={
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Add new event listener
          </Button>
        }
      />

      <Modal
        title="Create event listener"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
        }}
        destroyOnClose
      >
        <EditListenerForm form={form} guild={guildId} onFinish={() => setIsModalOpen(false)} />
      </Modal>
    </Card>
  )
}
