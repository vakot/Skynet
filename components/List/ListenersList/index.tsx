import { BugOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { IListener } from '@bot/models/listener'
import { EditListenerForm } from '@components/Form/EditListenerForm'
import { useGetListenersQuery } from '@modules/api/listener/listener.api'
import { Button, Empty, Form, List, ListProps, Modal, Space } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface ListenersListProps extends Omit<ListProps<IListener>, 'dataSource'> {
  guild?: Guild['id']
}

export const ListenersList: React.FC<ListenersListProps> = ({
  guild: guildId,
  loading,
  ...props
}) => {
  const { data: listeners, isLoading: isListenersLoading } = useGetListenersQuery()

  return (
    <List loading={loading || isListenersLoading} {...props}>
      {listeners?.map((listener) => (
        <ListenersListItem key={listener._id} listener={listener} guild={guildId} />
      )) || (!isListenersLoading ? <Empty /> : null)}
    </List>
  )
}

export interface ListenersListItemProps {
  listener: IListener
  guild: ListenersListProps['guild']
}

export const ListenersListItem: React.FC<ListenersListItemProps> = ({
  listener,
  guild: guildId,
}) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<BugOutlined />}
        title={listener.name || listener._id}
        description={listener.description}
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
        title="Edit event listener"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
        }}
        destroyOnClose
      >
        <EditListenerForm
          form={form}
          guild={guildId}
          listener={listener._id}
          onFinish={() => setIsModalOpen(false)}
        />
      </Modal>
    </List.Item>
  )
}
