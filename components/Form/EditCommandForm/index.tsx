import { EditFormProps } from '@components/Form'
import {
  useAddCommandMutation,
  useEditCommandMutation,
  useGetCommandQuery,
} from '@modules/api/command/command.api'
import { useGetGuildQuery, useGetGuildsQuery } from '@modules/api/guild/guild.api'
import { Button, Flex, Form, FormInstance, Input, Select } from 'antd'
import { ApplicationCommand, BaseGuild } from 'discord.js'
import { useEffect } from 'react'

export interface EditCommandFormProps extends EditFormProps {
  command?: ApplicationCommand['id']
  guild?: BaseGuild['id']
  onFinish?: (value?: ApplicationCommand) => void
}

export const EditCommandForm: React.FC<EditCommandFormProps> = ({
  form: _form,
  command: commandId,
  guild: guildId,
  onFinish,
  onFinishFailed,
  onAbort,
  showControls,
  ...props
}) => {
  const [form] = Form.useForm(_form)

  const { data: command, isLoading: isCommandLoading } = useGetCommandQuery(
    { id: commandId, guild: guildId },
    { skip: !commandId }
  )
  const { data: guild, isLoading: isGuildLoading } = useGetGuildQuery(guildId, { skip: !guildId })
  const [addCommand, { isLoading: isAddLoading }] = useAddCommandMutation()
  const [editCommand, { isLoading: isEditLoading }] = useEditCommandMutation()

  const isLoading = isCommandLoading || isGuildLoading || isEditLoading || isAddLoading
  const isGlobal = !!command && !!command.id && !command.guildId

  const handleFinish = async (fields: any) => {
    try {
      const response = command
        ? await editCommand({ id: command.id, ...fields })
        : await addCommand(fields)

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
  }, [form, commandId, command, guildId, guild])

  return (
    <Form
      initialValues={{
        name: command?.name,
        description: command?.description,
        guild: command?.guildId ?? guild?.id,
        // permissions: command?.permissions,
      }}
      onFinish={handleFinish}
      form={form}
      layout="vertical"
      {...props}
    >
      <Name form={form} command={command} disabled={isLoading || isGlobal} />
      <Description form={form} command={command} disabled={isLoading || isGlobal} />
      <Guild
        form={form}
        command={command}
        disabled={isLoading || isGlobal || (!!guildId && !!guild)}
      />

      {showControls && (
        <Flex justify="end" gap={8}>
          {isGlobal ? (
            <Button type="primary" onClick={handleAbort} disabled={isLoading}>
              Close
            </Button>
          ) : (
            <>
              <Button type="default" onClick={handleAbort} disabled={isLoading}>
                Discard
              </Button>
              <Button type="primary" onClick={form.submit} disabled={isLoading}>
                Save
              </Button>
            </>
          )}
        </Flex>
      )}
    </Form>
  )
}

interface EditCommandFormItem {
  form: FormInstance
  command?: ApplicationCommand
  disabled?: boolean
}

const Name: React.FC<EditCommandFormItem> = ({ form, command, disabled }) => {
  return (
    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Required' }]}>
      <Input placeholder="Name..." disabled={disabled} />
    </Form.Item>
  )
}
const Description: React.FC<EditCommandFormItem> = ({ form, command, disabled }) => {
  return (
    <Form.Item
      label="Description"
      name="description"
      rules={[{ required: true, message: 'Required' }]}
    >
      <Input.TextArea rows={3} placeholder="Description..." disabled={disabled} />
    </Form.Item>
  )
}
const Guild: React.FC<EditCommandFormItem> = ({ form, command, disabled }) => {
  const { data: guilds } = useGetGuildsQuery()

  return (
    <Form.Item label="Guild" name="guild" rules={[{ required: true, message: 'Required' }]}>
      <Select
        showSearch
        allowClear
        disabled={disabled}
        placeholder="Guild..."
        options={guilds?.map((guild) => ({
          value: guild.id,
          label: guild.name || guild.id,
        }))}
      />
    </Form.Item>
  )
}
