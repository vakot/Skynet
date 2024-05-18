import { BugOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { EditCommandForm } from '@components/Form/EditCommandForm'
import { useGetCommandsQuery } from '@modules/api/command/command.api'
import { Button, Empty, Form, List, ListProps, Modal, Space } from 'antd'
import { ApplicationCommand, Guild } from 'discord.js'
import { useState } from 'react'

export interface CommandsListProps extends Omit<ListProps<ApplicationCommand>, 'dataSource'> {
  guild?: Guild['id']
}

export const CommandsList: React.FC<CommandsListProps> = ({
  guild: guildId,
  loading,
  ...props
}) => {
  const { data: commands, isLoading: isCommandsLoading } = useGetCommandsQuery({ guild: guildId })

  return (
    <List loading={loading || isCommandsLoading} {...props}>
      {commands?.map((command) => (
        <CommandsListItem key={command.id} command={command} guild={guildId} />
      )) || (!isCommandsLoading ? <Empty /> : null)}
    </List>
  )
}

export interface CommandsListItemProps {
  command: ApplicationCommand
  guild: CommandsListProps['guild']
}

export const CommandsListItem: React.FC<CommandsListItemProps> = ({ command, guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const isGlobal = !!command && !!command.id && !command.guildId

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<BugOutlined />}
        title={`/${command.name}`}
        description={command.description}
      />

      <Space>
        <Button type="primary" onClick={() => setIsModalOpen(true)} disabled={isGlobal}>
          <EditOutlined />
        </Button>
        <Button
          danger
          onClick={() => {
            // TODO: delete
          }}
          disabled={isGlobal}
        >
          <DeleteOutlined />
        </Button>
      </Space>

      <Modal
        title="Edit command"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
        }}
        destroyOnClose
      >
        <EditCommandForm
          form={form}
          guild={guildId}
          command={command.id}
          onFinish={() => setIsModalOpen(false)}
        />
      </Modal>
    </List.Item>
  )
}
