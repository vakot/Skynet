import { BugOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, List, ListProps, Space } from 'antd'
import { ApplicationCommand } from 'discord.js'

export interface CommandsListProps extends Omit<ListProps<ApplicationCommand>, 'dataSource'> {
  data?: ApplicationCommand[]
  onSelect?: (item: ApplicationCommand) => void
  onDelete?: (item: ApplicationCommand) => void
}

export const CommandsList: React.FC<CommandsListProps> = ({
  data,
  onSelect,
  onDelete,
  ...props
}) => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <List {...props}>
        {data?.map((command) => (
          <List.Item key={command.id}>
            <List.Item.Meta
              avatar={<BugOutlined />}
              title={`/${command.name}`}
              description={command.description}
            />

            <Space>
              <Button
                type="primary"
                disabled={!command.guildId}
                onClick={() => onSelect?.(command)}
              >
                <EditOutlined />
              </Button>
              <Button
                type="primary"
                disabled={!command.guildId}
                danger
                onClick={() => onDelete?.(command)}
              >
                <DeleteOutlined />
              </Button>
            </Space>
          </List.Item>
        ))}
      </List>
    </Space>
  )
}
