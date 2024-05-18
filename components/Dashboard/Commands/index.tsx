import { EditCommandForm } from '@components/Form/EditCommandForm'
import { CommandsList } from '@components/List/CommandsList'
import { Button, Card, Form, Modal } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface CommandsProps {
  guild?: Guild['id']
}

export const Commands: React.FC<CommandsProps> = ({ guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <Card>
      <CommandsList
        guild={guildId}
        header={
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Add new command
          </Button>
        }
      />

      <Modal
        title="Create command"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
        }}
        destroyOnClose
      >
        <EditCommandForm form={form} guild={guildId} onFinish={() => setIsModalOpen(false)} />
      </Modal>
    </Card>
  )
}
