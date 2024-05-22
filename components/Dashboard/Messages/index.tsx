import { FileTextFilled } from '@ant-design/icons'
import { IMessage } from '@bot/models/message'
import { EditMessageForm } from '@components/Form/EditMessageForm'
import { RoutesBreadcrumb } from '@components/UI/RoutesBreadcrumb'
import { useGetMessageQuery, useGetMessagesQuery } from '@modules/api/message/message.api'
import { AppRoutes } from '@utils/routes'
import { Button, Card, Empty, Flex, Menu, Space } from 'antd'
import { useRouter } from 'next/router'

export interface MessagesProps {
  message?: IMessage['_id']
}

export const Messages: React.FC<MessagesProps> = ({ message: messageId }) => {
  const router = useRouter()

  const { data: message, isLoading: isMessageLoading } = useGetMessageQuery(messageId, {
    skip: !messageId,
  })
  const { data: messages, isLoading: isMessagesLoading } = useGetMessagesQuery()

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
          ]}
        />
        <Space>
          {!!messageId && !!message && (
            <Button type="primary" danger>
              Delete message
            </Button>
          )}
          <Button type="primary" onClick={() => router.push(AppRoutes.MESSAGES)}>
            Create message
          </Button>
        </Space>
      </Flex>

      <Flex gap={8}>
        <Card
          size="small"
          style={{ width: 240, maxHeight: 338, overflowX: 'hidden', overflowY: 'auto' }}
          loading={isMessagesLoading}
        >
          {!messages ? (
            <Empty />
          ) : (
            <Menu
              mode="inline"
              onSelect={({ keyPath }) =>
                router.push([AppRoutes.MESSAGES, ...keyPath.toReversed()].join('/'))
              }
              selectedKeys={[messageId]}
              items={messages.map(({ _id, name }) => ({
                key: _id,
                icon: <FileTextFilled />,
                label: name || _id,
              }))}
            />
          )}
        </Card>

        <Card loading={isMessageLoading} title={message?.name || message?._id} style={{ flex: 1 }}>
          <EditMessageForm
            message={messageId}
            onFinish={(value) => router.push([AppRoutes.MESSAGES, value?._id].join('/'))}
            onAbort={() => router.push(AppRoutes.MESSAGES)}
            showControls
          />
        </Card>
      </Flex>
    </Space>
  )
}
