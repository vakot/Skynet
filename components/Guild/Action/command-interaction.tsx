import { SkynetEvents } from '@bot/models/event'
import { ActionProps } from '@components/Guild/Action'
import { Button } from '@components/UI/Button'
import { useGetActionByIdQuery, useGetActionsQuery } from '@modules/api/action/action.api'
import { useGetGuildByIdQuery, usePostGuildMutation } from '@modules/api/guild/guild.api'
import { Form, Input } from 'antd'
import { useState } from 'react'

const CommandInteraction: React.FC<ActionProps> = ({ guild: guildId, action: actionId }) => {
  if (actionId === 'add') {
    return <Add guild={guildId} />
  }

  return <Edit guild={guildId} action={actionId} />
}

const Edit: React.FC<any> = ({ guild: guildId, action: actionId }) => {
  const [form] = Form.useForm()
  const [saved, setSaved] = useState<boolean>(true)

  const { data: guild } = useGetGuildByIdQuery(guildId)
  const { data: action } = useGetActionByIdQuery(actionId)
  // TODO: useGetClientCommandQuery(commandName)
  // TODO: useGetClientGuildCommandQuery({commandName, guildId})

  const [updateGuild] = usePostGuildMutation()

  const handleSave = async () => {
    const fields = await form.validateFields()

    console.log({ fields })

    updateGuild({
      id: guildId,
    }).then(() => {
      setSaved(true)
    })
  }
  const handleRegister = () => {
    console.log('TODO: register or unregister command')
  }
  const handleDelete = () => {
    console.log('TODO: delete command')
  }
  const handleDiscard = () => {
    form.resetFields()
    setSaved(true)
  }

  return (
    <Form
      form={form}
      onChange={() => setSaved(false)}
      layout="vertical"
      initialValues={{
        commandName: guild?.[SkynetEvents.CommandInteraction][actionId].name,
      }}
    >
      <Form.Item
        name="commandName"
        label={<p style={{ color: 'white' }}>Command</p>}
        rules={[{ required: true, message: 'Required' }]}
        required
      >
        <Input placeholder="/command-name..." />
      </Form.Item>

      {/* TODO: command options */}

      <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', gap: 8 }}>
        {!saved ? (
          <>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
            <Button type="error" onClick={handleDiscard}>
              Discard
            </Button>
          </>
        ) : (
          <>
            <Button type="primary" onClick={handleRegister}>
              Register
            </Button>
            <Button type="error" onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}

        {/* TODO: if author - show edit link button */}
      </div>
    </Form>
  )
}

const Add: React.FC<any> = ({ guild: guildId }) => {
  const { data: guild } = useGetGuildByIdQuery(guildId)
  const { data: actions } = useGetActionsQuery()

  console.log(guild, actions)

  return <>TODO: actions select</>
}

export default CommandInteraction
