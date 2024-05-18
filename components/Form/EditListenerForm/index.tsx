import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { IAction } from '@bot/models/action'
import { SkynetEvents } from '@bot/models/event'
import { IListener } from '@bot/models/listener'
import { EditFormProps } from '@components/Form'
import { EditActionForm } from '@components/Form/EditActionForm'
import { EditCommandForm } from '@components/Form/EditCommandForm'
import { useGetActionQuery, useGetActionsQuery } from '@modules/api/action/action.api'
import { useGetCommandsQuery } from '@modules/api/command/command.api'
import { useGetGuildQuery, useGetGuildsQuery } from '@modules/api/guild/guild.api'
import {
  useAddListenerMutation,
  useEditListenerMutation,
  useGetListenerQuery,
} from '@modules/api/listener/listener.api'
import { toTitleCase } from '@utils/helpers/toTitleCase'
import { Button, Card, Flex, Form, FormInstance, Input, Select, Space } from 'antd'
import { BaseGuild } from 'discord.js'
import { useEffect, useState } from 'react'

export interface EditListenerFormProps extends EditFormProps {
  listener?: IListener['_id']
  action?: IAction['_id']
  guild?: BaseGuild['id']
  onFinish?: (value?: IListener) => void
}

export const EditListenerForm: React.FC<EditListenerFormProps> = ({
  form: _form,
  listener: listenerId,
  action: actionId,
  guild: guildId,
  onFinish,
  onFinishFailed,
  onAbort,
  showControls,
  ...props
}) => {
  const [form] = Form.useForm(_form)

  const { data: listener, isLoading: isListenerLoading } = useGetListenerQuery(listenerId, {
    skip: !listenerId,
  })
  const { data: action, isLoading: isActionLoading } = useGetActionQuery(actionId, {
    skip: !actionId,
  })
  const { data: guild, isLoading: isGuildLoading } = useGetGuildQuery(guildId, { skip: !guildId })

  const [addListener, { isLoading: isAddLoading }] = useAddListenerMutation()
  const [editListener, { isLoading: isEditLoading }] = useEditListenerMutation()

  const isLoading =
    isListenerLoading || isActionLoading || isGuildLoading || isEditLoading || isAddLoading

  const handleFinish = async (fields: any) => {
    try {
      const response = listener
        ? await editListener({ id: listener._id, ...fields })
        : await addListener(fields)

      if ('data' in response) {
        onFinish?.(response.data)
      } else if ('error' in response) {
        throw response.error
      }
    } catch (error: any) {
      onFinishFailed?.(error)
    }
  }

  const handleAbort = () => {
    form.resetFields()
    onAbort?.()
  }

  useEffect(() => {
    form.resetFields()
  }, [form, listenerId, listener, actionId, action, guildId, guild])

  return (
    <Form
      initialValues={{
        name: listener?.name,
        description: listener?.description,
        action: listener?.action?._id || action?._id,
        guild: listener?.guild || guild?.id,
        event: listener?.event || action?.event,
        component: listener?.component,
      }}
      onFinish={handleFinish}
      form={form}
      layout="vertical"
      {...props}
    >
      <Name form={form} listener={listener} disabled={isLoading} />
      <Description form={form} listener={listener} disabled={isLoading} />
      <Guild form={form} listener={listener} disabled={isLoading || (!!guildId && !!guild)} />
      <Action form={form} listener={listener} disabled={isLoading || (!!actionId && !!action)} />
      <Event form={form} listener={listener} disabled={isLoading || (!!actionId && !!action)} />
      <Component form={form} listener={listener} disabled={isLoading} />

      {showControls && (
        <Flex justify="end" gap={8}>
          <Button type="default" onClick={handleAbort} disabled={isLoading}>
            Discard
          </Button>
          <Button type="primary" onClick={form.submit} disabled={isLoading}>
            Save
          </Button>
        </Flex>
      )}
    </Form>
  )
}

interface EditListenerFormItem {
  form: FormInstance
  listener?: IListener
  disabled?: boolean
}

const Name: React.FC<EditListenerFormItem> = ({ form, listener, disabled }) => {
  return (
    <Form.Item label="Name" name="name">
      <Input placeholder="Name..." disabled={disabled} />
    </Form.Item>
  )
}
const Description: React.FC<EditListenerFormItem> = ({ form, listener, disabled }) => {
  return (
    <Form.Item label="Description" name="description">
      <Input.TextArea rows={3} placeholder="Description..." disabled={disabled} />
    </Form.Item>
  )
}
const Guild: React.FC<EditListenerFormItem> = ({ form, listener, disabled }) => {
  const guildId = Form.useWatch('guild', form)

  const { data: guild } = useGetGuildQuery(guildId, { skip: !guildId })
  const { data: guilds } = useGetGuildsQuery()

  useEffect(() => {
    form.setFieldValue('guild', listener?.guild || guild?.id)
  }, [form, listener, guild, guildId])

  return (
    <Form.Item label="Guild" name="guild">
      <Select
        showSearch
        allowClear
        placeholder="Guild..."
        disabled={disabled}
        options={guilds?.map((guild) => ({
          value: guild.id,
          label: guild.name || guild.id,
        }))}
      />
    </Form.Item>
  )
}
const Action: React.FC<EditListenerFormItem> = ({ form, listener, disabled }) => {
  const [isNestedFormOpen, setIsNestedFormOpen] = useState<boolean>(false)

  const event = Form.useWatch('event', form)
  const actionId = Form.useWatch('action', form)

  const { data: actions } = useGetActionsQuery({ event })

  return (
    <Form.Item label="Action" required>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex gap={8}>
          <Form.Item noStyle name="action" rules={[{ required: true, message: 'Required' }]}>
            <Select
              showSearch
              allowClear
              placeholder="Action..."
              disabled={disabled || isNestedFormOpen}
              options={actions?.map((action) => ({
                value: action._id,
                label: action.name || action._id,
              }))}
            />
          </Form.Item>
          <Button
            type="primary"
            onClick={() => setIsNestedFormOpen(true)}
            disabled={disabled || isNestedFormOpen}
          >
            {actionId ? <EditOutlined /> : <PlusOutlined />}
          </Button>
        </Flex>

        {isNestedFormOpen && (
          <Card size="small">
            <EditActionForm
              action={actionId}
              onFinish={(value) => {
                setIsNestedFormOpen(false)
                form.setFieldValue('action', value?._id)
              }}
              onAbort={() => {
                setIsNestedFormOpen(false)
              }}
              showControls
            />
          </Card>
        )}
      </Space>
    </Form.Item>
  )
}
const Event: React.FC<EditListenerFormItem> = ({ form, listener, disabled }) => {
  const actionId = Form.useWatch('action', form)

  const { data: action } = useGetActionQuery(actionId, { skip: !actionId })

  useEffect(() => {
    if (actionId && action) {
      form.setFieldValue('event', action.event)
    }
  }, [form, actionId, action])

  return (
    <Form.Item label="Event" name="event" rules={[{ required: true, message: 'Required' }]}>
      <Select
        allowClear
        showSearch
        placeholder="Event..."
        disabled={disabled || (!!actionId && !!action)}
        options={Object.values(SkynetEvents).map((skynetEvent) => ({
          label: skynetEvent
            .split('-')
            .map((word) => toTitleCase(word))
            .join(' '),
          value: skynetEvent,
        }))}
      />
    </Form.Item>
  )
}
const Component: React.FC<EditListenerFormItem> = ({ form, listener, disabled }) => {
  const event = Form.useWatch('event', form)

  const InnerForm = event && event in ComponentsForms ? (ComponentsForms as any)[event] : null

  if (InnerForm) {
    return <InnerForm form={form} disabled={disabled} />
  }
}

const ComponentsForms: { [key: string]: React.FC<{ form: FormInstance; disabled?: boolean }> } = {
  [SkynetEvents.CommandInteraction]: ({ form, disabled }) => {
    const [isNestedFormOpen, setIsNestedFormOpen] = useState<boolean>(false)

    const guildId = Form.useWatch('guild', form)
    const commandId = Form.useWatch('component', form)

    const { data: commands } = useGetCommandsQuery({ guild: guildId })

    return (
      <Form.Item label="Command" required>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Flex gap={8}>
            <Form.Item
              style={{ flex: 1 }}
              name="component"
              rules={[{ required: true, message: '' }]}
              noStyle
            >
              <Select
                allowClear
                showSearch
                disabled={disabled || isNestedFormOpen}
                placeholder="Select command..."
                options={commands?.map((command) => ({
                  label: command.name,
                  value: command.id,
                }))}
              />
            </Form.Item>
            <Button
              type="primary"
              onClick={() => setIsNestedFormOpen(true)}
              disabled={disabled || isNestedFormOpen}
            >
              {commandId ? <EditOutlined /> : <PlusOutlined />}
            </Button>
          </Flex>

          {isNestedFormOpen && (
            <Card size="small">
              <EditCommandForm
                command={commandId}
                guild={guildId}
                onFinish={(value) => {
                  form.setFieldValue('component', value?.id)
                  setIsNestedFormOpen(false)
                }}
                onAbort={() => {
                  setIsNestedFormOpen(false)
                }}
                showControls
              />
            </Card>
          )}
        </Space>
      </Form.Item>
    )
  },
}
