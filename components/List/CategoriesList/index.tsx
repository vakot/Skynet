import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ICategory } from '@bot/models/category'
import { EditCategoryForm } from '@components/Form/EditCategoryForm'
import { useGetCategoriesQuery } from '@modules/api/category/category.api'
import { Button, Empty, Form, List, ListProps, Modal, Space } from 'antd'
import { Guild } from 'discord.js'
import { useState } from 'react'

export interface CategoriesListProps extends Omit<ListProps<ICategory>, 'dataSource'> {
  guild?: Guild['id']
}

export const CategoriesList: React.FC<CategoriesListProps> = ({
  guild: guildId,
  loading,
  ...props
}) => {
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery()

  return (
    <List loading={loading || isCategoriesLoading} {...props}>
      {categories?.map((category) => (
        <CategoriesListItem key={category.id} category={category} guild={guildId} />
      )) || (!isCategoriesLoading ? <Empty /> : null)}
    </List>
  )
}

export interface CategoriesListItemProps {
  category: ICategory
  guild: CategoriesListProps['guild']
}

export const CategoriesListItem: React.FC<CategoriesListItemProps> = ({
  category,
  guild: guildId,
}) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const isGlobal = !!category && category._id.startsWith('global-')

  return (
    <List.Item>
      <List.Item.Meta
        avatar={category.emoji}
        title={category.name || category._id}
        description={category.description}
      />

      <Space>
        <Button type="primary" onClick={() => setIsModalOpen(true)} disabled={isGlobal}>
          <EditOutlined />
        </Button>
        <Button
          danger
          onClick={() => {
            // TODO: delete
          }}
          disabled={isGlobal}
        >
          <DeleteOutlined />
        </Button>
      </Space>

      <Modal
        title="Edit category"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
        }}
        destroyOnClose
      >
        <EditCategoryForm
          form={form}
          category={category._id}
          onFinish={() => setIsModalOpen(false)}
        />
      </Modal>
    </List.Item>
  )
}
