import { CodeFilled, PlaySquareFilled } from '@ant-design/icons'
import { IAutomation } from '@bot/models/automation'
import { SkynetEvents } from '@bot/models/event'
import { EditAutomationForm } from '@components/Form/EditAutomationForm'
import { RoutesBreadcrumb } from '@components/UI/RoutesBreadcrumb'
import {
  useGetAutomationQuery,
  useGetAutomationsQuery,
} from '@modules/api/automation/automation.api'

import { useGetGuildQuery } from '@modules/api/guild/guild.api'
import { AppRoutes } from '@utils/routes'
import { Button, Card, Empty, Flex, Menu, Space } from 'antd'
import { Guild } from 'discord.js'
import { useRouter } from 'next/router'

export interface AutomationsProps {
  automation?: IAutomation['_id']
  guild?: Guild['id']
}

export const Automations: React.FC<AutomationsProps> = ({
  automation: automationId,
  guild: guildId,
}) => {
  const router = useRouter()

  const { data: guild, isLoading: isGuildLoading } = useGetGuildQuery(guildId, { skip: !guildId })
  const { data: automation, isLoading: isAutomationLoading } = useGetAutomationQuery(automationId, {
    skip: !automationId,
  })
  const { data: automations, isLoading: isAutomationsLoading } = useGetAutomationsQuery()

  if (!guild) {
    return <Empty />
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Flex justify="space-between">
        <RoutesBreadcrumb
          items={[
            {
              path: AppRoutes.DASHBOARD,
              title: 'Home',
            },
            {
              path: [AppRoutes.DASHBOARD, guild.id],
              title: guild.name || 'Home',
            },
            {
              path: [AppRoutes.DASHBOARD, guild.id, 'automations'],
              title: 'Automations',
            },
          ]}
        />
        <Space>
          {!!automationId && !!automation && (
            <Button type="primary" danger>
              Delete automation
            </Button>
          )}
          <Button
            type="primary"
            onClick={() => router.push([AppRoutes.DASHBOARD, guild.id, 'automations'].join('/'))}
          >
            Create automation
          </Button>
        </Space>
      </Flex>

      <Flex gap={8}>
        <Card
          size="small"
          style={{ width: 240, maxHeight: 338, overflowX: 'hidden', overflowY: 'auto' }}
          loading={isAutomationsLoading}
        >
          {!automations ? (
            <Empty />
          ) : (
            <Menu
              mode="inline"
              onSelect={({ keyPath }) =>
                router.push(
                  [AppRoutes.DASHBOARD, guild.id, 'automations', ...keyPath.toReversed()].join('/')
                )
              }
              selectedKeys={automationId ? [automationId] : []}
              items={automations.map(({ _id, name, event }) => ({
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
          loading={isAutomationLoading}
          title={automation?.name || automation?._id}
          style={{ flex: 1 }}
        >
          <EditAutomationForm
            automation={automationId}
            guild={guildId}
            onFinish={(value) =>
              router.push([AppRoutes.DASHBOARD, guild.id, 'automations', value?._id].join('/'))
            }
            onAbort={() => router.push([AppRoutes.DASHBOARD, guild.id, 'automations'].join('/'))}
            showControls
          />
        </Card>
      </Flex>
    </Space>
  )
}
