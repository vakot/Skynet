import { BugOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { IEmbed } from '@bot/models/embed'
import { EditEmbedForm } from '@components/Form/EditEmbedForm'
import { useGetEmbedsQuery } from '@modules/api/embed/embed.api'
import { Button, Empty, Form, List, ListProps, Modal, Space } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface EmbedsListProps extends Omit<ListProps<IEmbed>, 'dataSource'> {
  guild?: Guild['id']
}

export const EmbedsList: React.FC<EmbedsListProps> = ({ guild: guildId, loading, ...props }) => {
  const { data: embeds, isLoading: isEmbedsLoading } = useGetEmbedsQuery()

  return (
    <List loading={loading || isEmbedsLoading} {...props}>
      {embeds?.map((embed) => <EmbedsListItem key={embed.id} embed={embed} guild={guildId} />) ||
        (!isEmbedsLoading ? <Empty /> : null)}
    </List>
  )
}

export interface EmbedsListItemProps {
  embed: IEmbed
  guild: EmbedsListProps['guild']
}

export const EmbedsListItem: React.FC<EmbedsListItemProps> = ({ embed, guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<BugOutlined style={{ color: embed.color }} />}
        title={embed.title || embed._id}
        description={embed.description}
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
        title="Edit embed template"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
        }}
        destroyOnClose
      >
        <EditEmbedForm form={form} embed={embed._id} onFinish={() => setIsModalOpen(false)} />
      </Modal>
    </List.Item>
  )
}
