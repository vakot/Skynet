import { EditCategoryForm } from '@components/Form/EditCategoryForm'
import { CategoriesList } from '@components/List/CategoriesList'
import { Button, Card, Form, Modal } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface CategoriesProps {
  guild?: Guild['id']
}

export const Categories: React.FC<CategoriesProps> = ({ guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <Card>
      <CategoriesList
        guild={guildId}
        header={
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Add new category
          </Button>
        }
      />

      <Modal
        title="Create custom category"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
        }}
        destroyOnClose
      >
        <EditCategoryForm form={form} onFinish={() => setIsModalOpen(false)} />
      </Modal>
    </Card>
  )
}
