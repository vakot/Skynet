import { ICategory } from '@bot/models/category'
import { EditCategoryForm } from '@components/Form/EditCategoryForm'
import { RoutesBreadcrumb } from '@components/UI/RoutesBreadcrumb'
import { useGetCategoriesQuery, useGetCategoryQuery } from '@modules/api/category/category.api'
import { AppRoutes } from '@utils/routes'
import { Button, Card, Empty, Flex, Menu, Space } from 'antd'
import { useRouter } from 'next/router'

export interface CategoriesProps {
  category?: ICategory['_id']
}

export const Categories: React.FC<CategoriesProps> = ({ category: categoryId }) => {
  const router = useRouter()

  const { data: category, isLoading: isCategoryLoading } = useGetCategoryQuery(categoryId, {
    skip: !categoryId,
  })
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery()

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Flex justify="space-between">
        <RoutesBreadcrumb
          items={[
            {
              path: AppRoutes.DASHBOARD,
              title: 'Dashboard',
            },
            {
              path: AppRoutes.CATEGORIES,
              title: 'Categories',
            },
          ]}
        />
        <Space>
          {!!categoryId && !!category && (
            <Button type="primary" danger>
              Delete category
            </Button>
          )}
          <Button type="primary" onClick={() => router.push(AppRoutes.CATEGORIES)}>
            Create category
          </Button>
        </Space>
      </Flex>

      <Flex gap={8}>
        <Card
          size="small"
          style={{ width: 240, maxHeight: 338, overflowX: 'hidden', overflowY: 'auto' }}
          loading={isCategoriesLoading}
        >
          {!categories ? (
            <Empty />
          ) : (
            <Menu
              mode="inline"
              onSelect={({ keyPath }) =>
                router.push([AppRoutes.CATEGORIES, ...keyPath.toReversed()].join('/'))
              }
              selectedKeys={[categoryId]}
              items={categories.map(({ _id, emoji, name }) => ({
                key: _id,
                icon: emoji,
                label: name || _id,
              }))}
            />
          )}
        </Card>

        <Card
          loading={isCategoryLoading}
          title={category?.name || category?._id}
          style={{ flex: 1 }}
        >
          <EditCategoryForm
            category={categoryId}
            onFinish={(value) => router.push([AppRoutes.CATEGORIES, value?._id].join('/'))}
            onAbort={() => router.push(AppRoutes.CATEGORIES)}
            showControls
          />
        </Card>
      </Flex>
    </Space>
  )
}
