import { CodeFilled, PlaySquareFilled } from '@ant-design/icons'
import { SkynetEvents } from '@bot/models/event'
import { IListener } from '@bot/models/listener'
import { EditListenerForm } from '@components/Form/EditListenerForm'
import { RoutesBreadcrumb } from '@components/UI/RoutesBreadcrumb'
import { useGetGuildQuery } from '@modules/api/guild/guild.api'
import { useGetListenerQuery, useGetListenersQuery } from '@modules/api/listener/listener.api'
import { AppRoutes } from '@utils/routes'
import { Button, Card, Empty, Flex, Menu, Space } from 'antd'
import { Guild } from 'discord.js'
import { useRouter } from 'next/router'

export interface ListenersProps {
  guild?: Guild['id']
  listener?: IListener['_id']
}

export const Listeners: React.FC<ListenersProps> = ({ guild: guildId, listener: listenerId }) => {
  const router = useRouter()

  const { data: guild, isLoading: isGuildLoading } = useGetGuildQuery(guildId, { skip: !guildId })
  const { data: listener, isLoading: isListenerLoading } = useGetListenerQuery(listenerId, {
    skip: !listenerId,
  })
  const { data: listeners, isLoading: isListenersLoading } = useGetListenersQuery(
    { guild: guildId },
    { skip: !guildId }
  )

  if (!guild) {
    return <Empty />
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Flex justify="space-between">
        <RoutesBreadcrumb
          loading={isGuildLoading}
          items={[
            {
              path: AppRoutes.DASHBOARD,
              title: 'Dashboard',
            },
            {
              path: [AppRoutes.DASHBOARD, guild.id],
              title: guild.name || 'Home',
            },
            {
              path: [AppRoutes.DASHBOARD, guild.id, 'listeners'],
              title: 'Commands',
            },
          ]}
        />
        <Space>
          {!!listenerId && !!listener && (
            <Button type="primary" danger>
              Delete listener
            </Button>
          )}
          <Button
            type="primary"
            onClick={() => router.push([AppRoutes.DASHBOARD, guild.id, 'listeners'].join('/'))}
          >
            Create listener
          </Button>
        </Space>
      </Flex>

      <Flex gap={8}>
        <Card
          size="small"
          style={{ width: 240, maxHeight: 338, overflowX: 'hidden', overflowY: 'auto' }}
          loading={isListenersLoading}
        >
          {!listeners ? (
            <Empty />
          ) : (
            <Menu
              mode="inline"
              onSelect={({ keyPath }) =>
                router.push(
                  [AppRoutes.DASHBOARD, guild.id, 'listeners', ...keyPath.toReversed()].join('/')
                )
              }
              selectedKeys={listenerId ? [listenerId] : []}
              items={listeners.map(({ _id, name, event }) => ({
                key: _id,
                icon:
                  event === SkynetEvents.CommandInteraction ? (
                    <CodeFilled />
                  ) : event === SkynetEvents.ButtonInteraction ? (
                    <PlaySquareFilled />
                  ) : null,
                label: name || _id,
              }))}
            />
          )}
        </Card>

        <Card
          loading={isListenerLoading}
          title={listener?.name || listener?._id}
          style={{ flex: 1 }}
        >
          <EditListenerForm
            listener={listenerId}
            guild={guildId}
            onFinish={(value) =>
              router.push([AppRoutes.DASHBOARD, guild.id, 'listeners', value?._id].join('/'))
            }
            onAbort={() => router.push([AppRoutes.DASHBOARD, guild.id, 'listeners'].join('/'))}
            showControls
          />
        </Card>
      </Flex>
    </Space>
  )
}
