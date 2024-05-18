import { BugOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { IAction } from '@bot/models/action'
import { Button, List, ListProps, Space } from 'antd'

export interface ActionsListProps extends Omit<ListProps<IAction>, 'dataSource'> {
  data?: IAction[]
  onSelect?: (item: IAction) => void
  onDelete?: (item: IAction) => void
}

export const ActionsList: React.FC<ActionsListProps> = ({ data, onSelect, onDelete, ...props }) => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <List {...props}>
        {data?.map((action) => (
          <List.Item key={action._id}>
            <List.Item.Meta
              avatar={<BugOutlined />}
              title={action.name || action._id}
              description={action.description}
            />

            <Space>
              <Button type="primary" onClick={() => onSelect?.(action)}>
                <EditOutlined />
              </Button>
              <Button type="primary" danger onClick={() => onDelete?.(action)}>
                <DeleteOutlined />
              </Button>
            </Space>
          </List.Item>
        ))}
      </List>
    </Space>
  )
}
