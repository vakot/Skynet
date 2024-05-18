import { EditCategoryForm } from '@components/Form/EditCategoryForm'
import { CategoriesList } from '@components/List/CategoriesList'
import { useGetCategoriesQuery } from '@modules/api/category/category.api'
import { Button, Card, Form, Modal, Space } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface CategoriesProps {
  guild?: Guild['id']
}

export const Categories: React.FC<CategoriesProps> = ({ guild: guildId }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery()

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
            Add new Categorie
          </Button>

          <CategoriesList
            data={categories}
            loading={isCategoriesLoading}
            onSelect={(category) => {
              setSelectedId(category._id)
              setIsModalOpen(true)
            }}
          />

          <Modal
            title={selectedId ? 'Edit category' : 'Create custom category'}
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={() => {
              form.resetFields()
              setSelectedId(undefined)
              setIsModalOpen(false)
            }}
          >
            <EditCategoryForm
              form={form}
              category={selectedId}
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
