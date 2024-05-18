import { EditEmbedForm } from '@components/Form/EditEmbedForm'
import { EmbedsList } from '@components/List/EmbedsList'
import { useGetEmbedsQuery } from '@modules/api/embed/embed.api'
import { Button, Card, Form, Modal, Space } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface EmbedsProps {
  guild?: Guild['id']
}

export const Embeds: React.FC<EmbedsProps> = ({ guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  const { data: embeds, isLoading: isEmbedsLoading } = useGetEmbedsQuery()

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button
            type="primary"
            onClick={() => {
              setSelectedId(undefined)
              setIsModalOpen(true)
            }}
          >
            Add new embed
          </Button>

          <EmbedsList
            data={embeds}
            loading={isEmbedsLoading}
            onSelect={(embed) => {
              setSelectedId(embed._id)
              setIsModalOpen(true)
            }}
          />

          <Modal
            title={selectedId ? 'Edit embed template' : 'Create embed template'}
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={() => {
              form.resetFields()
              setSelectedId(undefined)
              setIsModalOpen(false)
            }}
          >
            <EditEmbedForm
              form={form}
              embed={selectedId}
              onFinish={() => {
                setSelectedId(undefined)
                setIsModalOpen(false)
              }}
            />
          </Modal>
        </Space>
      </Card>
    </Space>
  )
}
