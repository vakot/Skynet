import { EditListenerForm } from '@components/Form/EditListenerForm'
import { ListenersList } from '@components/List/ListenersList'
import { useGetListenersQuery } from '@modules/api/listener/listener.api'
import { Button, Card, Form, Modal, Space } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface ListenersProps {
  guild?: Guild['id']
}

export const Listeners: React.FC<ListenersProps> = ({ guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  const { data: listeners, isLoading: isListenersLoading } = useGetListenersQuery({
    guild: guildId,
  })

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
            Add new Listener
          </Button>

          <ListenersList
            data={listeners}
            loading={isListenersLoading}
            onSelect={(listener) => {
              setSelectedId(listener._id)
              setIsModalOpen(true)
            }}
          />

          <Modal
            title={selectedId ? 'Edit event listener' : 'Create event listener'}
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={() => {
              form.resetFields()
              setSelectedId(undefined)
              setIsModalOpen(false)
            }}
          >
            <EditListenerForm
              form={form}
              listener={selectedId}
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
