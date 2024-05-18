import { EditActionForm } from '@components/Form/EditActionForm'
import { ActionsList } from '@components/List/ActionsList'
import { Button, Card, Form, Modal } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface ActionsProps {
  guild?: Guild['id']
}

export const Actions: React.FC<ActionsProps> = ({ guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <Card>
      <ActionsList
        guild={guildId}
        header={
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Add new action
          </Button>
        }
      />

      <Modal
        title="Create action"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
        }}
        destroyOnClose
      >
        <EditActionForm form={form} onFinish={() => setIsModalOpen(false)} />
      </Modal>
    </Card>
  )
}
