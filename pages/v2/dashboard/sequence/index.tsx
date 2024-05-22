import {
  DeleteFilled,
  EditFilled,
  PlusOutlined,
  QuestionCircleFilled,
  StepForwardFilled,
  UndoOutlined,
} from '@ant-design/icons'
import Main from '@components/Layouts/Main'
import { useGetGuildChannelsQuery } from '@modules/api/guild/guild.api'
import { useGetMessagesQuery } from '@modules/api/message/message.api'
import { AppRoutes } from '@utils/routes'
import { Button, Card, Flex, Form, FormInstance, Input, Select, Space, Steps } from 'antd'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import React, { useEffect } from 'react'

const SequencePage_unstable: React.FC = () => {
  const [form] = Form.useForm()

  return (
    <Main>
      <Card>
        <Form form={form}>
          <Form.List name="items">
            {(fields, { add, remove, move }) => (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Steps
                  direction="vertical"
                  current={1}
                  items={[
                    {
                      title: 'Entry',
                      subTitle: 'async function (client, interaction)',
                      description: <Form.Item>Entry point</Form.Item>,
                    },
                    ...fields.map((field) => ({
                      title: <Title form={form} name={field.name} />,
                      subTitle: <Description form={form} name={field.name} />,
                      description: (
                        <Flex gap={8}>
                          <Value form={form} name={field.name} />
                          <Button danger type="primary" onClick={() => remove(field.name)}>
                            <DeleteFilled />
                          </Button>
                        </Flex>
                      ),
                    })),
                  ]}
                />
                <Flex gap={8}>
                  <Button block type="dashed" onClick={() => add({ type: 4, title: 'Loop' })}>
                    <UndoOutlined /> Add loop step
                  </Button>
                  <Button block type="dashed" onClick={() => add({ type: 1, title: 'Condition' })}>
                    <QuestionCircleFilled /> Add condition step
                  </Button>
                  <Button block type="dashed" onClick={() => add({ type: 0, title: 'Execute' })}>
                    <StepForwardFilled /> Add execution step
                  </Button>
                </Flex>
              </Space>
            )}
          </Form.List>
        </Form>
      </Card>
    </Main>
  )
}

const Title: React.FC<{ form?: FormInstance; name: string | number }> = ({ form, name }) => {
  return Form.useWatch(['items', name, 'title'], form)
}

const Value: React.FC<{ form?: FormInstance; name: string | number }> = ({ form, name }) => {
  const type = Form.useWatch(['items', name, 'type'], form)

  return (
    <Form.Item style={{ flex: 1 }} name={[name, 'value']} noStyle>
      {type === 0 ? <Execute form={form} name={name} /> : null}
    </Form.Item>
  )
}

const Execute: React.FC<{ form?: FormInstance; name: string | number }> = ({ form, name }) => {
  const executeType = Form.useWatch(['items', name, 'value', 'execute', 'type'], form)

  const execute = {
    'send-message': <SendMessage form={form} name={name} />,
    reply: <Reply form={form} name={name} />,
    'delete-message': <DeleteMessage form={form} name={name} />,
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Form.Item noStyle name={[name, 'value', 'execute', 'type']}>
        <Select
          style={{ width: '100%' }}
          allowClear
          showSearch
          optionFilterProp="label"
          options={[
            {
              label: 'Send message',
              value: 'send-message',
            },
            {
              label: 'Reply',
              value: 'reply',
            },
            {
              label: 'Delete message',
              value: 'delete-message',
            },
          ]}
        />
      </Form.Item>
      {executeType in execute ? (execute as any)[executeType] : null}
    </Space>
  )
}

const SendMessage: React.FC<{ form?: FormInstance; name: string | number }> = ({ form, name }) => {
  const { data: channels, isLoading: isGuildChannelsLoading } =
    useGetGuildChannelsQuery('1073762507686158486')
  const { data: messages, isLoading: isMessagesLoading } = useGetMessagesQuery()

  const channelId = Form.useWatch(['items', name, 'value', 'execute', 'channel'], form)
  const messageId = Form.useWatch(['items', name, 'value', 'execute', 'message'], form)

  useEffect(() => {
    form?.setFieldValue(
      ['items', name, 'description'],
      `await ${channelId ? 'channel' : 'interaction.channel'}.send(${
        messageId ? '{ ...message }' : ''
      })`
    )
  }, [form, name, channelId, messageId])

  return (
    <Flex gap={8}>
      <Form.Item name={[name, 'value', 'execute', 'channel']} noStyle>
        <Select
          style={{ flex: 1 }}
          placeholder="Channel..."
          showSearch
          allowClear
          disabled={isGuildChannelsLoading}
          loading={isGuildChannelsLoading}
          options={channels?.map((channel) => ({
            label: channel.name || channel.id,
            value: channel.id,
          }))}
        />
      </Form.Item>
      <Form.Item name={[name, 'value', 'execute', 'message']} noStyle>
        <Select
          style={{ flex: 1 }}
          placeholder="Message..."
          showSearch
          allowClear
          disabled={isMessagesLoading}
          loading={isMessagesLoading}
          options={messages?.map((message) => ({
            label: message.name || message._id,
            value: message._id,
          }))}
        />
      </Form.Item>
      <Button type="primary" disabled={isMessagesLoading} loading={isMessagesLoading}>
        {messageId ? <EditFilled /> : <PlusOutlined />}
      </Button>
    </Flex>
  )
}
const DeleteMessage: React.FC<{ form?: FormInstance; name: string | number }> = ({
  form,
  name,
}) => {
  useEffect(() => {
    form?.setFieldValue(['items', name, 'description'], 'await interaction.message.delete()')
  }, [form, name])

  return null
}
const Reply: React.FC<{ form?: FormInstance; name: string | number }> = ({ form, name }) => {
  const { data: messages, isLoading: isMessagesLoading } = useGetMessagesQuery()

  const text = Form.useWatch(['items', name, 'value', 'execute', 'text'], form)
  const messageId = Form.useWatch(['items', name, 'value', 'execute', 'message'], form)
  const ephemeral = Form.useWatch(['items', name, 'value', 'execute', 'ephemeral'], form)

  useEffect(() => {
    form?.setFieldValue(
      ['items', name, 'description'],
      `await interaction.reply({ ${
        text ? 'content: text,' : messageId ? '...message,' : ''
      } ephemeral: ${!!ephemeral} })`
    )
  }, [form, name, ephemeral, text, messageId])

  return (
    <Flex gap={8}>
      <Form.Item name={[name, 'value', 'execute', 'text']} noStyle>
        <Input
          style={{ flex: messageId ? 0.25 : 1 }}
          placeholder="Text..."
          allowClear
          disabled={!!messageId}
        />
      </Form.Item>
      <Form.Item name={[name, 'value', 'execute', 'message']} noStyle>
        <Select
          style={{ flex: text ? 0.25 : 1 }}
          placeholder="Message..."
          showSearch
          allowClear
          disabled={isMessagesLoading || !!text}
          loading={isMessagesLoading}
          options={messages?.map((message) => ({
            label: message.name || message._id,
            value: message._id,
          }))}
        />
      </Form.Item>
      <Button type="primary" disabled={isMessagesLoading || !!text} loading={isMessagesLoading}>
        {messageId ? <EditFilled /> : <PlusOutlined />}
      </Button>
      <Form.Item name={[name, 'value', 'execute', 'ephemeral']} noStyle>
        <Button
          type={ephemeral ? 'primary' : 'dashed'}
          onClick={() =>
            form?.setFieldValue(['items', name, 'value', 'execute', 'ephemeral'], !ephemeral)
          }
        >
          Ephemeral
        </Button>
      </Form.Item>
    </Flex>
  )
}

const Description: React.FC<{ form?: FormInstance; name: string | number }> = ({ form, name }) => {
  return Form.useWatch(['items', name, 'description'], form)
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return { redirect: { destination: AppRoutes.AUTH } }
  }

  return {
    props: {},
  }
}

export default SequencePage_unstable
