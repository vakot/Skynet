import { BugOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { IEmbed } from '@bot/models/embed'
import { Button, List, ListProps, Space } from 'antd'

export interface EmbedsListProps extends Omit<ListProps<IEmbed>, 'dataSource'> {
  data?: IEmbed[]
  onSelect?: (item: IEmbed) => void
  onDelete?: (item: IEmbed) => void
}

export const EmbedsList: React.FC<EmbedsListProps> = ({
  data: embeds,
  onSelect,
  onDelete,
  ...props
}) => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <List {...props}>
        {embeds?.map((embed) => (
          <List.Item key={embed._id}>
            <List.Item.Meta
              avatar={<BugOutlined />}
              title={embed.name || embed._id}
              description={embed.description}
            />

            <Space>
              <Button type="primary" onClick={() => onSelect?.(embed)}>
                <EditOutlined />
              </Button>
              <Button type="primary" danger onClick={() => onDelete?.(embed)}>
                <DeleteOutlined />
              </Button>
            </Space>
          </List.Item>
        ))}
      </List>
    </Space>
  )
}
