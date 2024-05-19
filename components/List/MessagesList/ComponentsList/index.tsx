import { BugOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { IMessageComponent } from '@bot/models/message'
import { EditMessageComponentForm } from '@components/Form/EditMessageForm/EditComponentForm'
import { useGetMessageComponentsQuery } from '@modules/api/message/component/component.api'
import { Button, Empty, Form, List, ListProps, Modal, Space } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface ComponentsListProps extends Omit<ListProps<IMessageComponent>, 'dataSource'> {
  guild?: Guild['id']
}

export const ComponentsList: React.FC<ComponentsListProps> = ({
  guild: guildId,
  loading,
  ...props
}) => {
  const { data: components, isLoading: isComponentsLoading } = useGetMessageComponentsQuery()

  return (
    <List loading={loading || isComponentsLoading} {...props}>
      {!components?.length || isComponentsLoading ? (
        <Empty style={{ marginTop: 16 }} />
      ) : (
        components?.map((component) => (
          <ComponentsListItem key={component.id} component={component} guild={guildId} />
        ))
      )}
    </List>
  )
}

export interface ComponentsListItemProps {
  component: IMessageComponent
  guild: ComponentsListProps['guild']
}

export const ComponentsListItem: React.FC<ComponentsListItemProps> = ({
  component,
  guild: guildId,
}) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<BugOutlined />}
        title={component.name}
        description={component.description}
      />

      <Space>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          <EditOutlined />
        </Button>
        <Button
          danger
          onClick={() => {
            // TODO: delete
          }}
        >
          <DeleteOutlined />
        </Button>
      </Space>

      <Modal
        title="Edit message component"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
        }}
        destroyOnClose
      >
        <EditMessageComponentForm
          form={form}
          component={component._id}
          onFinish={() => setIsModalOpen(false)}
        />
      </Modal>
    </List.Item>
  )
}
