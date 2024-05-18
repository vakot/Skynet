import { EditActionForm } from '@components/Form/EditActionForm'
import { EmbedsList } from '@components/List/EmbedsList'
import { useGetActionsQuery } from '@modules/api/action/action.api'
import { Button, Card, Form, Modal, Space } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface ActionsProps {
  guild?: Guild['id']
}

export const Actions: React.FC<ActionsProps> = ({ guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  const { data: actions, isLoading: isActionsLoading } = useGetActionsQuery()

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
            Add new action
          </Button>

          <EmbedsList
            data={actions}
            loading={isActionsLoading}
            onSelect={(action) => {
              setSelectedId(action._id)
              setIsModalOpen(true)
            }}
          />

          <Modal
            title={selectedId ? 'Edit action' : 'Create action'}
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={() => {
              form.resetFields()
              setSelectedId(undefined)
              setIsModalOpen(false)
            }}
          >
            <EditActionForm
              form={form}
              action={selectedId}
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
