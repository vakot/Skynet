import { EditCommandForm } from '@components/Form/EditCommandForm'
import { CommandsList } from '@components/List/CommandsList'
import { useGetCommandsQuery } from '@modules/api/command/command.api'
import { Button, Card, Form, Modal, Space } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface CommandsProps {
  guild?: Guild['id']
}

export const Commands: React.FC<CommandsProps> = ({ guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  const { data: commands, isLoading: isCommandsLoading } = useGetCommandsQuery({
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
            Add new Command
          </Button>

          <CommandsList
            data={commands}
            loading={isCommandsLoading}
            onSelect={(command) => {
              setSelectedId(command.id)
              setIsModalOpen(true)
            }}
          />

          <Modal
            title={selectedId ? 'Edit command' : 'Create command'}
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={() => {
              form.resetFields()
              setSelectedId(undefined)
              setIsModalOpen(false)
            }}
          >
            <EditCommandForm
              form={form}
              command={selectedId}
              guild={guildId}
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
