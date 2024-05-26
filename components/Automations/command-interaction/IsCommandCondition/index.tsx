import { EditFilled, PlusOutlined } from '@ant-design/icons'
import { SkynetEvents } from '@bot/models/event'
import { AutomationItemProps } from '@components/Automations/command-interaction'
import { EditCommandForm } from '@components/Form/EditCommandForm'
import { useGetCommandsQuery } from '@modules/api/command/command.api'
import { Button, Flex, Form, Modal, Select } from 'antd'
import { useState } from 'react'

export const IsCommandCondition: React.FC<AutomationItemProps> = ({
  form,
  guild: guildId,
  name,
}) => {
  const [editCommandForm] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const { data: commands, isLoading: isCommandsLoading } = useGetCommandsQuery(
    { guild: guildId },
    { skip: !guildId }
  )

  const commandId: string | undefined = Form.useWatch(['conditions', name, 'value', 'value'], form)

  return (
    <Form.Item label="Command" style={{ margin: 0 }}>
      <Flex gap={8}>
        <Form.Item name={[name, 'value', 'value']} noStyle>
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            loading={isCommandsLoading}
            disabled={isCommandsLoading}
            placeholder="Guild command..."
            options={commands?.map((command) => ({
              value: command.id,
              label: `/${command.name}`,
            }))}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Button
          type="primary"
          loading={isCommandsLoading}
          disabled={isCommandsLoading}
          onClick={() => setIsModalOpen(true)}
        >
          {commandId ? <EditFilled /> : <PlusOutlined />}
        </Button>

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
            onFinish={(value) =>
              form?.setFieldValue(['conditions', name, 'value', 'value'], value?.id)
            }
          />
        </Modal>
      </Flex>
    </Form.Item>
  )
}

export const isCommandConditionDefault = {
  event: SkynetEvents.CommandInteraction,
  type: 'isCommand',
  value: {
    property: 'commandId',
  },
}
