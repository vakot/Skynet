import { BookFilled } from '@ant-design/icons'
import { IEmbed } from '@bot/models/message'
import { EditEmbedForm } from '@components/Form/EditEmbedForm'
import { RoutesBreadcrumb } from '@components/UI/RoutesBreadcrumb'
import { useGetEmbedQuery, useGetEmbedsQuery } from '@modules/api/embed/embed.api'
import { AppRoutes } from '@utils/routes'
import { Button, Card, Empty, Flex, Menu, Space } from 'antd'
import { useRouter } from 'next/router'

export interface EmbedsProps {
  embed?: IEmbed['_id']
}

export const Embeds: React.FC<EmbedsProps> = ({ embed: embedId }) => {
  const router = useRouter()

  const { data: embed, isLoading: isEmbedLoading } = useGetEmbedQuery(embedId, {
    skip: !embedId,
  })
  const { data: embeds, isLoading: isEmbedsLoading } = useGetEmbedsQuery()

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
              path: AppRoutes.MESSAGES,
              title: 'Messages',
            },
            {
              path: AppRoutes.EMBEDS,
              title: 'Embeds',
            },
          ]}
        />
        <Space>
          {!!embedId && !!embed && (
            <Button type="primary" danger>
              Delete embed
            </Button>
          )}
          <Button type="primary" onClick={() => router.push(AppRoutes.EMBEDS)}>
            Create embed
          </Button>
        </Space>
      </Flex>

      <Flex gap={8}>
        <Card
          size="small"
          style={{ width: 240, maxHeight: 338, overflowX: 'hidden', overflowY: 'auto' }}
          loading={isEmbedsLoading}
        >
          {!embeds ? (
            <Empty />
          ) : (
            <Menu
              mode="inline"
              onSelect={({ keyPath }) =>
                router.push([AppRoutes.EMBEDS, ...keyPath.toReversed()].join('/'))
              }
              selectedKeys={[embedId]}
              items={embeds?.map(({ _id, title }) => ({
                key: _id,
                icon: <BookFilled />,
                label: title || _id,
              }))}
            />
          )}
        </Card>

        <Card loading={isEmbedLoading} title={embed?.title || embed?._id} style={{ flex: 1 }}>
          <EditEmbedForm
            embed={embedId}
            onFinish={(value) => router.push([AppRoutes.EMBEDS, value?._id].join('/'))}
            onAbort={() => router.push(AppRoutes.EMBEDS)}
            showControls
          />
        </Card>
      </Flex>
    </Space>
  )
}
