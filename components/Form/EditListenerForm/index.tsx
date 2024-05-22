import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { IAction } from '@bot/models/action'
import { SkynetEvents } from '@bot/models/event'
import { IListener } from '@bot/models/listener'
import { EditFormItemProps, EditFormProps } from '@components/Form'
import { EditActionForm } from '@components/Form/EditActionForm'
import { EditCommandForm } from '@components/Form/EditCommandForm'
import { SelectEvent } from '@components/UI/Select/SelectEvent'
import { useGetActionQuery, useGetActionsQuery } from '@modules/api/action/action.api'
import { useGetCommandsQuery } from '@modules/api/command/command.api'
import { useGetGuildQuery, useGetGuildsQuery } from '@modules/api/guild/guild.api'
import {
  useAddListenerMutation,
  useEditListenerMutation,
  useGetListenerQuery,
} from '@modules/api/listener/listener.api'
import { Button, Flex, Form, Input, Modal, Select, Space } from 'antd'
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
      <Name form={form} disabled={isLoading} />
      <Description form={form} disabled={isLoading} />
      <Guild form={form} disabled={isLoading || (!!guildId && !!guild)} />
      <Action form={form} disabled={isLoading || (!!actionId && !!action)} />
      <Event form={form} disabled={isLoading || (!!actionId && !!action)} />
      <Component form={form} disabled={isLoading} />

      {showControls && (
        <Flex justify="end" gap={8}>
          <Button type="default" onClick={handleAbort} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="primary" onClick={form.submit} disabled={isLoading}>
            Save
          </Button>
        </Flex>
      )}
    </Form>
  )
}

const Name: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item label="Name" name="name">
      <Input placeholder="Name..." disabled={disabled} />
    </Form.Item>
  )
}
const Description: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item label="Description" name="description">
      <Input.TextArea rows={3} placeholder="Description..." disabled={disabled} />
    </Form.Item>
  )
}
const Guild: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  const { data: guilds } = useGetGuildsQuery()

  return (
    <Form.Item label="Guild" name="guild">
      <Select
        showSearch
        allowClear
        placeholder="Guild..."
        disabled={disabled}
        optionFilterProp="label"
        options={guilds?.map((guild) => ({
          value: guild.id,
          label: guild.name || guild.id,
        }))}
      />
    </Form.Item>
  )
}
const Action: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  const [editActionForm] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

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
              disabled={disabled || isModalOpen}
              optionFilterProp="label"
              options={actions?.map((action) => ({
                value: action._id,
                label: action.name || action._id,
              }))}
            />
          </Form.Item>
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            disabled={disabled || isModalOpen}
          >
            {actionId ? <EditOutlined /> : <PlusOutlined />}
          </Button>
        </Flex>

        <Modal
          style={{ minWidth: '720px' }}
          open={isModalOpen}
          okText="Save"
          cancelText="Cancel"
          onOk={() => editActionForm.submit()}
          onCancel={() => {
            editActionForm.resetFields()
            setIsModalOpen(false)
          }}
          destroyOnClose
        >
          <EditActionForm
            form={editActionForm}
            action={actionId}
            onFinish={(value) => {
              setIsModalOpen(false)
              form.setFieldValue('action', value?._id)
            }}
          />
        </Modal>
      </Space>
    </Form.Item>
  )
}
const Event: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  const actionId = Form.useWatch('action', form)

  const { data: action, isLoading: isActionLoading } = useGetActionQuery(actionId, {
    skip: !actionId,
  })

  useEffect(() => {
    if (actionId && action) {
      form.setFieldValue('event', action.event)
    }
  }, [form, actionId, action])

  return (
    <Form.Item label="Event" name="event" rules={[{ required: true, message: 'Required' }]}>
      <SelectEvent
        loading={isActionLoading}
        disabled={disabled || isActionLoading || (!!actionId && !!action)}
      />
    </Form.Item>
  )
}
const Component: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  const event = Form.useWatch('event', form)

  const InnerForm = event && event in ComponentsForms ? (ComponentsForms as any)[event] : null

  if (InnerForm) {
    return <InnerForm form={form} disabled={disabled} />
  }
}

const ComponentsForms: { [key: string]: React.FC<EditFormItemProps> } = {
  [SkynetEvents.CommandInteraction]: ({ form, disabled }) => {
    const [editCommandForm] = Form.useForm()

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const guildId = Form.useWatch('guild', form)
    const commandId = Form.useWatch('component', form)

    const { data: commands, isLoading: isCommandsLoading } = useGetCommandsQuery({ guild: guildId })

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
                loading={isCommandsLoading}
                disabled={disabled || isCommandsLoading}
                placeholder="Select command..."
                optionFilterProp="label"
                options={commands?.map((command) => ({
                  label: command.name,
                  value: command.id,
                }))}
              />
            </Form.Item>
            <Button
              type="primary"
              loading={isCommandsLoading}
              onClick={() => setIsModalOpen(true)}
              disabled={disabled || isCommandsLoading}
            >
              {commandId ? <EditOutlined /> : <PlusOutlined />}
            </Button>
          </Flex>

          <Modal
            open={isModalOpen}
            okText="Save"
            cancelText="Cancel"
            onOk={() => {
              editCommandForm.submit()
              setIsModalOpen(false)
            }}
            onCancel={() => {
              editCommandForm.resetFields()
              setIsModalOpen(false)
            }}
            destroyOnClose
          >
            <EditCommandForm
              command={commandId}
              guild={guildId}
              onFinish={(value) => form.setFieldValue('component', value?.id)}
            />
          </Modal>
        </Space>
      </Form.Item>
    )
  },
  // [SkynetEvents.ButtonInteraction]: ({ form, disabled }) => {
  //   const [editComponentForm] = Form.useForm()

  //   const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  //   const componentId = Form.useWatch('component', form)

  //   const { data: components, isLoading: isComponentsLoading } = useGetMessageComponentsQuery({
  //     type: SkynetEvents.ButtonInteraction,
  //   })

  //   return (
  //     <Form.Item label="Component" required>
  //       <Space direction="vertical" style={{ width: '100%' }}>
  //         <Flex gap={8}>
  //           <Form.Item
  //             style={{ flex: 1 }}
  //             name="component"
  //             rules={[{ required: true, message: '' }]}
  //             noStyle
  //           >
  //             <Select
  //               allowClear
  //               showSearch
  //               disabled={disabled || isComponentsLoading}
  //               loading={isComponentsLoading}
  //               placeholder="Select button..."
  //               optionFilterProp="label"
  //               options={components?.map((component) => ({
  //                 label: component.name || component._id,
  //                 value: component._id,
  //               }))}
  //             />
  //           </Form.Item>
  //           <Button
  //             type="primary"
  //             onClick={() => setIsModalOpen(true)}
  //             disabled={disabled || isComponentsLoading}
  //           >
  //             {componentId ? <EditOutlined /> : <PlusOutlined />}
  //           </Button>
  //         </Flex>

  //         <Modal
  //           open={isModalOpen}
  //           okText="Save"
  //           cancelText="Cancel"
  //           onOk={() => {
  //             editComponentForm.submit()
  //             setIsModalOpen(false)
  //           }}
  //           onCancel={() => {
  //             editComponentForm.resetFields()
  //             setIsModalOpen(false)
  //           }}
  //           destroyOnClose
  //         >
  //           <EditMessageComponentForm
  //             form={editComponentForm}
  //             component={componentId}
  //             onFinish={(value) => form.setFieldValue('component', value?._id)}
  //           />
  //         </Modal>
  //       </Space>
  //     </Form.Item>
  //   )
  // },
}
