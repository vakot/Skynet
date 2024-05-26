import { IAutomation } from '@bot/models/automation'
import { SkynetEvents } from '@bot/models/event'
import {
  CommandInteractionActions,
  CommandInteractionConditions,
} from '@components/Automations/command-interaction'
import { EditFormItemProps, EditFormProps } from '@components/Form'
import { SelectEvent } from '@components/UI/Select/SelectEvent'
import {
  useAddAutomationMutation,
  useEditAutomationMutation,
  useGetAutomationQuery,
} from '@modules/api/automation/automation.api'
import { useGetGuildQuery, useGetGuildsQuery } from '@modules/api/guild/guild.api'
import { Button, Card, Flex, Form, FormInstance, Input, Modal, Select, Space } from 'antd'
import { Guild as ApiGuild } from 'discord.js'
import { useEffect, useState } from 'react'
import Masonry from 'react-smart-masonry-layout'

export interface EditAutomationFormProps extends EditFormProps {
  automation?: IAutomation['_id']
  guild?: ApiGuild['id']
  onFinish?: (value?: IAutomation) => void
}

export const EditAutomationForm: React.FC<EditAutomationFormProps> = ({
  form: _form,
  automation: automationId,
  guild: guildId,
  onFinish,
  onFinishFailed,
  onAbort,
  showControls,
  ...props
}) => {
  const [form] = Form.useForm(_form)

  const { data: guild, isLoading: isGuildLoading } = useGetGuildQuery(guildId, { skip: !guildId })
  const { data: automation, isLoading: isAutomationLoading } = useGetAutomationQuery(automationId, {
    skip: !automationId || !guild,
  })
  const [addAutomation, { isLoading: isAddLoading }] = useAddAutomationMutation()
  const [editAutomation, { isLoading: isEditLoading }] = useEditAutomationMutation()

  const isLoading = isGuildLoading || isAutomationLoading || isEditLoading || isAddLoading

  const handleFinish = async (fields: any) => {
    try {
      const response = automation
        ? await editAutomation({ id: automation._id, ...fields })
        : await addAutomation(fields)
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
    form.setFieldsValue({
      name: automation?.name,
      description: automation?.description,
      guild: automation?.guild || guild?.id,
      event: automation?.event,
      conditions: automation?.conditions,
      actions: automation?.actions,
    })
  }, [form, automationId, automation, guildId, guild])

  return (
    <Form onFinish={handleFinish} form={form} layout="vertical" {...props}>
      <Name form={form} disabled={isLoading} />
      <Description form={form} disabled={isLoading} />
      <Guild form={form} disabled={isLoading || (!!guildId && !!guild)} />
      <Form.Item label="Sequence">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Event form={form} disabled={isLoading || (!!automationId && !!automation)} />
          <Conditions form={form} disabled={isLoading} />
          <Actions form={form} disabled={isLoading} />
        </Space>
      </Form.Item>

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
  const { data: guilds, isLoading: isGuildsLoading } = useGetGuildsQuery()

  return (
    <Form.Item label="Guild" name="guild">
      <Select
        showSearch
        allowClear
        placeholder="Guild..."
        disabled={disabled || isGuildsLoading}
        loading={isGuildsLoading}
        optionFilterProp="label"
        options={guilds?.map((guild) => ({
          value: guild.id,
          label: guild.name || guild.id,
        }))}
      />
    </Form.Item>
  )
}
const Event: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  const event = Form.useWatch('event', form)

  useEffect(() => {
    if (!disabled) {
      if (event === SkynetEvents.CommandInteraction) {
        form?.setFieldValue('conditions', [CommandInteractionConditions.isCommand.default])
      }
    }
  }, [form, event, disabled])

  return (
    <Card size="small" title="WHEN">
      <Form.Item name="event" noStyle>
        <SelectEvent disabled={disabled} style={{ width: '100%' }} />
      </Form.Item>
    </Card>
  )
}

const Conditions: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  const event = Form.useWatch('event', form)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <Form.List name="conditions">
      {(fields, { add, remove, move }) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          {fields.map((field) => (
            <Space key={field.name} direction="vertical" size={0} style={{ width: '100%' }}>
              <Button type="link" danger onClick={() => remove(field.name)} disabled={disabled}>
                Delete
              </Button>
              <Condition form={form} name={field.name} />
            </Space>
          ))}

          <Modal
            open={isModalOpen}
            destroyOnClose
            okButtonProps={{ style: { display: 'none' } }}
            cancelButtonProps={{ style: { display: 'none' } }}
            onCancel={() => setIsModalOpen(false)}
            title="Select condition"
          >
            <Masonry
              gutter={16}
              breakpoints={{
                400: 2,
                600: 3,
              }}
              source={Object.values(CommandInteractionConditions)}
              render={(item) => (
                <Card
                  size="small"
                  title={item.icon}
                  onClick={() => {
                    add(item.default)
                    setIsModalOpen(false)
                  }}
                  hoverable
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {item.description}
                    <Button type="primary" block>
                      Add condition
                    </Button>
                  </Space>
                </Card>
              )}
            />
          </Modal>

          <Button
            block
            type="dashed"
            onClick={() => setIsModalOpen(true)}
            disabled={disabled || !event}
          >
            Add condition
          </Button>
        </Space>
      )}
    </Form.List>
  )
}
const Condition: React.FC<{ form?: FormInstance; name?: number }> = ({ form, name }) => {
  const condition = Form.useWatch(['conditions', name], form)
  const guildId = Form.useWatch('guild', form)

  const InnerComponent = (CommandInteractionConditions as any)[condition?.type]?.component

  return (
    <Card
      size="small"
      title={
        <Space>
          {name === 0 ? 'IF' : 'AND'}
          <span style={{ opacity: 0.5, fontWeight: 'lighter' }}>
            {(CommandInteractionConditions as any)[condition?.type]?.description}.
          </span>
        </Space>
      }
    >
      {InnerComponent && <InnerComponent form={form} guild={guildId} name={name} />}
    </Card>
  )
}
const Actions: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  const event = Form.useWatch('event', form)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <Form.List name="actions">
      {(fields, { add, remove, move }) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          {fields.map((field) => (
            <Space key={field.name} direction="vertical" size="small" style={{ width: '100%' }}>
              <Button type="link" danger onClick={() => remove(field.name)}>
                Delete
              </Button>
              <Action key={field.name} form={form} name={field.name} />
            </Space>
          ))}

          <Modal
            open={isModalOpen}
            destroyOnClose
            okButtonProps={{ style: { display: 'none' } }}
            cancelButtonProps={{ style: { display: 'none' } }}
            onCancel={() => setIsModalOpen(false)}
            title="Select action"
          >
            <Masonry
              gutter={16}
              breakpoints={{
                400: 2,
                600: 3,
              }}
              source={Object.values(CommandInteractionActions)}
              render={(item) => (
                <Card
                  size="small"
                  title={item.icon}
                  onClick={() => {
                    add(item.default)
                    setIsModalOpen(false)
                  }}
                  hoverable
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {item.description}
                    <Button type="primary" block>
                      Add action
                    </Button>
                  </Space>
                </Card>
              )}
            />
          </Modal>

          <Button
            block
            type="dashed"
            onClick={() => setIsModalOpen(true)}
            disabled={disabled || !event}
          >
            Add action
          </Button>
        </Space>
      )}
    </Form.List>
  )
}
const Action: React.FC<{ form?: FormInstance; name?: number }> = ({ form, name }) => {
  const action = Form.useWatch(['actions', name], form)
  const guildId = Form.useWatch('guild', form)

  const InnerComponent = (CommandInteractionActions as any)[action?.type]?.component

  return (
    <Card
      size="small"
      title={
        <Space>
          THEN
          <span style={{ opacity: 0.5, fontWeight: 'lighter' }}>
            {(CommandInteractionActions as any)[action?.type]?.description}
          </span>
        </Space>
      }
    >
      {InnerComponent && <InnerComponent form={form} guild={guildId} name={name} />}
    </Card>
  )
}
