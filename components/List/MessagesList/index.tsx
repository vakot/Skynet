import { BugOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { IMessage } from '@bot/models/message'
import { Button, List, ListProps, Space } from 'antd'

export interface MessagesListProps extends Omit<ListProps<IMessage>, 'dataSource'> {
  data?: IMessage[]
  onSelect?: (item: IMessage) => void
  onDelete?: (item: IMessage) => void
}

export const MessagesList: React.FC<MessagesListProps> = ({
  data: messages,
  onSelect,
  onDelete,
  ...props
}) => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <List {...props}>
        {messages?.map((message) => (
          <List.Item key={message._id}>
            <List.Item.Meta
              avatar={<BugOutlined />}
              title={message.name || message._id}
              description={message.description}
            />

            <Space>
              <Button type="primary" onClick={() => onSelect?.(message)}>
                <EditOutlined />
              </Button>
              <Button type="primary" danger onClick={() => onDelete?.(message)}>
                <DeleteOutlined />
              </Button>
            </Space>
          </List.Item>
        ))}
      </List>
    </Space>
  )
}
