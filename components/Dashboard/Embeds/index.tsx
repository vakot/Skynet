import { EditEmbedForm } from '@components/Form/EditEmbedForm'
import { EmbedsList } from '@components/List/EmbedsList'
import { Button, Card, Form, Modal } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface EmbedsProps {
  guild?: Guild['id']
}

export const Embeds: React.FC<EmbedsProps> = ({ guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <Card>
      <EmbedsList
        guild={guildId}
        header={
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Add new embed template
          </Button>
        }
      />

      <Modal
        title="Create embed template"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
        }}
        destroyOnClose
      >
        <EditEmbedForm form={form} onFinish={() => setIsModalOpen(false)} />
      </Modal>
    </Card>
  )
}
