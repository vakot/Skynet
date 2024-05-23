import { CodeFilled, PlaySquareFilled } from '@ant-design/icons'
import { IAction } from '@bot/models/action'
import { SkynetEvents } from '@bot/models/event'
import { EditActionForm } from '@components/Form/EditActionForm'
import { RoutesBreadcrumb } from '@components/UI/RoutesBreadcrumb'
import { useGetActionQuery, useGetActionsQuery } from '@modules/api/action/action.api'
import { AppRoutes } from '@utils/routes'
import { Button, Card, Empty, Flex, Menu, Space } from 'antd'
import { useRouter } from 'next/router'

export interface ActionsProps {
  action?: IAction['_id']
}

export const Actions: React.FC<ActionsProps> = ({ action: actionId }) => {
  const router = useRouter()

  const { data: action, isLoading: isActionLoading } = useGetActionQuery(actionId, {
    skip: !actionId,
  })
  const { data: actions, isLoading: isActionsLoading } = useGetActionsQuery()

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
              path: AppRoutes.ACTIONS,
              title: 'Actions',
            },
          ]}
        />
        <Space>
          {!!actionId && !!action && (
            <Button type="primary" danger>
              Delete action
            </Button>
          )}
          <Button type="primary" onClick={() => router.push(AppRoutes.ACTIONS)}>
            Create action
          </Button>
        </Space>
      </Flex>

      <Flex gap={8}>
        <Card
          size="small"
          style={{ width: 240, maxHeight: 338, overflowX: 'hidden', overflowY: 'auto' }}
          loading={isActionsLoading}
        >
          {!actions ? (
            <Empty />
          ) : (
            <Menu
              mode="inline"
              onSelect={({ keyPath }) =>
                router.push([AppRoutes.ACTIONS, ...keyPath.toReversed()].join('/'))
              }
              selectedKeys={actionId ? [actionId] : []}
              items={actions.map(({ _id, name, event }) => ({
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

        <Card loading={isActionLoading} title={action?.name || action?._id} style={{ flex: 1 }}>
          <EditActionForm
            action={actionId}
            onFinish={(value) => router.push([AppRoutes.ACTIONS, value?._id].join('/'))}
            onAbort={() => router.push(AppRoutes.ACTIONS)}
            showControls
          />
        </Card>
      </Flex>
    </Space>
  )
}
