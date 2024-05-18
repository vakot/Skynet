import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ICategory } from '@bot/models/category'
import { Button, List, ListProps, Space } from 'antd'

export interface CategoriesListProps extends Omit<ListProps<ICategory>, 'dataSource'> {
  data?: ICategory[]
  onSelect?: (item: ICategory) => void
  onDelete?: (item: ICategory) => void
}

export const CategoriesList: React.FC<CategoriesListProps> = ({
  data,
  onSelect,
  onDelete,
  ...props
}) => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <List {...props}>
        {data?.map((category) => (
          <List.Item key={category._id}>
            <List.Item.Meta
              avatar={category.emoji}
              title={category.name}
              description={category.description}
            />

            <Space>
              <Button
                type="primary"
                disabled={category._id.toString().startsWith('global-')}
                onClick={() => onSelect?.(category)}
              >
                <EditOutlined />
              </Button>
              <Button
                type="primary"
                disabled={category._id.toString().startsWith('global-')}
                danger
                onClick={() => onDelete?.(category)}
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
