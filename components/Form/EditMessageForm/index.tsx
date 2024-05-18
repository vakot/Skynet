import { DeleteOutlined } from '@ant-design/icons'
import { IMessage } from '@bot/models/message'
import { EditFormProps } from '@components/Form'
import {
  useAddMessageMutation,
  useEditMessageMutation,
  useGetMessageQuery,
} from '@modules/api/message/message.api'
import { Button, Flex, Form, FormInstance, Input, Select, Space, Tooltip } from 'antd'
import { useEffect } from 'react'

export interface EditMessageFormProps extends EditFormProps {
  message?: IMessage['id']
  onFinish?: (value?: IMessage) => void
}

export const EditMessageForm: React.FC<EditMessageFormProps> = ({
  form: _form,
  message: messageId,
  onFinish,
  onFinishFailed,
  onAbort,
  showControls,
  ...props
}) => {
  const [form] = Form.useForm(_form)

  const { data: message } = useGetMessageQuery(messageId, { skip: !messageId })
  const [addMessage] = useAddMessageMutation()
  const [editMessage] = useEditMessageMutation()

  const handleFinish = async (fields: any) => {
    try {
      const response = message
        ? await editMessage({ id: message._id, ...fields })
        : await addMessage(fields)

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
  }, [form, messageId, message])

  return (
    <Form
      initialValues={{
        name: message?.name,
        description: message?.description,
        content: message?.content,
        embeds: message?.embeds,
      }}
      onFinish={handleFinish}
      form={form}
      layout="vertical"
      {...props}
    >
      <Name form={form} message={message} />
      <Description form={form} message={message} />
      <Content form={form} message={message} />
      <Embeds form={form} message={message} />
      <Components form={form} message={message} />

      {showControls && (
        <Flex justify="end" gap={8}>
          <Button type="default" onClick={handleAbort}>
            Discard
          </Button>
          <Button type="primary" onClick={form.submit}>
            Save
          </Button>
        </Flex>
      )}
    </Form>
  )
}

interface EditMessageFormItem {
  form: FormInstance
  message?: IMessage
  disabled?: boolean
}

const Name: React.FC<EditMessageFormItem> = ({ form, message, disabled }) => {
  return (
    <Form.Item label="Name" name="name">
      <Input placeholder="Name..." disabled={disabled} />
    </Form.Item>
  )
}
const Description: React.FC<EditMessageFormItem> = ({ form, message, disabled }) => {
  return (
    <Form.Item label="Description" name="description">
      <Input.TextArea rows={3} placeholder="Description..." disabled={disabled} />
    </Form.Item>
  )
}
const Content: React.FC<EditMessageFormItem> = ({ form, message, disabled }) => {
  return (
    <Form.Item
      label="Content"
      name="content"
      rules={[{ max: 2000, message: 'Max length of 2000' }]}
    >
      <Input.TextArea maxLength={2000} rows={6} placeholder="Content..." />
    </Form.Item>
  )
}
const Embeds: React.FC<EditMessageFormItem> = ({ form, message, disabled }) => {
  // modal open
  // selected id

  return (
    <Form.Item label="Embeds">
      <Form.List name="embeds">
        {(fields, { add, remove }) => (
          <Space direction="vertical" style={{ width: '100%' }}>
            {fields.map((field, index) => (
              <Flex key={field.name} gap={8}>
                <Form.Item style={{ flex: 1 }} noStyle>
                  <Select placeholder="Embed..." />
                </Form.Item>
                <Tooltip title="Remove embed (will not be deleted)">
                  <Button type="primary" danger onClick={() => remove(index)}>
                    <DeleteOutlined />
                  </Button>
                </Tooltip>
                <Button type="primary">Edit</Button>
              </Flex>
            ))}

            <Button type="dashed" onClick={add} style={{ width: '100%' }}>
              Add embed
            </Button>
          </Space>
        )}
      </Form.List>

      {/* Modal */}
    </Form.Item>
  )
}
const Components: React.FC<EditMessageFormItem> = ({ form, message, disabled }) => {
  // modal open
  // selected id

  return (
    <Form.Item label="Components">
      <Form.List name="components">
        {(fields, { add, remove }) => (
          <Space direction="vertical" style={{ width: '100%' }}>
            {fields.map((field, index) => (
              <Flex key={field.name} gap={8}>
                <Form.Item style={{ flex: 1 }} noStyle>
                  <Select
                    mode="multiple"
                    placeholder="Row components..."
                    options={[
                      { value: '1', label: '1' },
                      { value: '2', label: '2' },
                      { value: '3', label: '3' },
                    ]}
                  />
                </Form.Item>
                <Button type="primary" danger onClick={() => remove(index)}>
                  <DeleteOutlined />
                </Button>
                <Button type="primary">Edit</Button>
              </Flex>
            ))}

            <Button type="dashed" onClick={add} style={{ width: '100%' }}>
              Add row
            </Button>
          </Space>
        )}
      </Form.List>

      {/* Modal */}
    </Form.Item>
  )
}
