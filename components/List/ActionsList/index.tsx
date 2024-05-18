import { BugOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { IAction } from '@bot/models/action'
import { EditActionForm } from '@components/Form/EditActionForm'
import { useGetActionsQuery } from '@modules/api/action/action.api'
import { Button, Empty, Form, List, ListProps, Modal, Space } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface ActionsListProps extends Omit<ListProps<IAction>, 'dataSource'> {
  guild?: Guild['id']
}

export const ActionsList: React.FC<ActionsListProps> = ({ guild: guildId, loading, ...props }) => {
  const { data: actions, isLoading: isActionsLoading } = useGetActionsQuery()

  return (
    <List loading={loading || isActionsLoading} {...props}>
      {actions?.map((action) => (
        <ActionsListItem key={action.id} action={action} guild={guildId} />
      )) || (!isActionsLoading ? <Empty /> : null)}
    </List>
  )
}

export interface ActionsListItemProps {
  action: IAction
  guild: ActionsListProps['guild']
}

export const ActionsListItem: React.FC<ActionsListItemProps> = ({ action, guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<BugOutlined />}
        title={action.name || action._id}
        description={action.description}
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
        title="Edit Action"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
        }}
        destroyOnClose
      >
        <EditActionForm form={form} action={action._id} onFinish={() => setIsModalOpen(false)} />
      </Modal>
    </List.Item>
  )
}
