import { BugOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { IListener } from '@bot/models/listener'
import { Button, List, ListProps, Space } from 'antd'

export interface ListenersListProps extends Omit<ListProps<IListener>, 'dataSource'> {
  data?: IListener[]
  onSelect?: (item: IListener) => void
  onDelete?: (item: IListener) => void
}

export const ListenersList: React.FC<ListenersListProps> = ({
  data,
  onSelect,
  onDelete,
  ...props
}) => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <List {...props}>
        {data?.map((listener) => (
          <List.Item key={listener._id}>
            <List.Item.Meta
              avatar={<BugOutlined />}
              title={listener.name || listener._id}
              description={listener.description}
            />

            <Space>
              <Button type="primary" onClick={() => onSelect?.(listener)}>
                <EditOutlined />
              </Button>
              <Button type="primary" danger onClick={() => onDelete?.(listener)}>
                <DeleteOutlined />
              </Button>
            </Space>
          </List.Item>
        ))}
      </List>
    </Space>
  )
}
