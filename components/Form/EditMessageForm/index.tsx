import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { IMessage } from '@bot/models/message'
import { EditFormItemProps, EditFormProps } from '@components/Form'
import { EditEmbedForm } from '@components/Form/EditEmbedForm'
import { EditMessageComponentForm } from '@components/Form/EditMessageForm/EditComponentForm'
import { useGetEmbedsQuery } from '@modules/api/embed/embed.api'
import { useGetMessageComponentsQuery } from '@modules/api/message/component/component.api'
import {
  useAddMessageMutation,
  useEditMessageMutation,
  useGetMessageQuery,
} from '@modules/api/message/message.api'
import { Button, Card, Flex, Form, Input, Select, Space, Tooltip } from 'antd'
import { useEffect, useState } from 'react'

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

  const { data: message, isLoading: isMessageLoading } = useGetMessageQuery(messageId, {
    skip: !messageId,
  })
  const [addMessage, { isLoading: isAddLoading }] = useAddMessageMutation()
  const [editMessage, { isLoading: isEditLoading }] = useEditMessageMutation()

  const isLoading = isMessageLoading || isEditLoading || isAddLoading

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
        embeds: message?.embeds || [],
        components: message?.components || [],
      }}
      onFinish={handleFinish}
      form={form}
      layout="vertical"
      {...props}
    >
      <Name form={form} disabled={isLoading} />
      <Description form={form} disabled={isLoading} />
      <Content form={form} disabled={isLoading} />
      <Embeds form={form} disabled={isLoading} />
      <Components form={form} disabled={isLoading} />

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
const Content: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item
      label="Content"
      name="content"
      rules={[{ max: 2000, message: 'Max length of 2000' }]}
    >
      <Input.TextArea disabled={disabled} maxLength={2000} rows={6} placeholder="Content..." />
    </Form.Item>
  )
}
const Embeds: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item label="Embeds">
      <Form.List name="embeds">
        {(fields, { add, remove }) => (
          <Space direction="vertical" style={{ width: '100%' }}>
            {fields.map((field) => (
              <Embed
                key={field.name}
                form={form}
                field={field}
                remove={remove}
                disabled={disabled}
              />
            ))}

            <Button type="dashed" onClick={() => add()} style={{ width: '100%' }}>
              Add embed
            </Button>
          </Space>
        )}
      </Form.List>
    </Form.Item>
  )
}
const Embed: React.FC<any> = ({ form, field, remove, disabled }) => {
  const [isNestedFormOpen, setIsNestedFormOpen] = useState<boolean>(false)

  const { data: embeds, isLoading: isEmbedsLoading } = useGetEmbedsQuery()

  const embedId = Form.useWatch(['embeds', field.name], form)

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Flex key={field.name} gap={8}>
        <Form.Item
          style={{ flex: 1 }}
          noStyle
          name={field.name}
          rules={[{ required: true, message: '' }]}
        >
          <Select
            showSearch
            allowClear
            disabled={disabled || isNestedFormOpen}
            loading={isEmbedsLoading}
            optionFilterProp="label"
            options={embeds?.map((embed) => ({
              value: embed._id,
              label: embed.title || embed._id,
            }))}
            placeholder="Embed..."
          />
        </Form.Item>
        <Tooltip title="Remove embed (will not be deleted)">
          <Button type="primary" danger onClick={() => remove(field.name)} disabled={disabled}>
            <DeleteOutlined />
          </Button>
        </Tooltip>
        <Button
          type="primary"
          onClick={() => setIsNestedFormOpen(true)}
          disabled={disabled || isNestedFormOpen}
        >
          {embedId ? <EditOutlined /> : <PlusOutlined />}
        </Button>
      </Flex>

      {isNestedFormOpen && (
        <Card size="small">
          <EditEmbedForm
            embed={embedId}
            onFinish={(value) => {
              setIsNestedFormOpen(false)
              form.setFieldValue(['embeds', field.name], value?._id)
            }}
            onAbort={() => {
              setIsNestedFormOpen(false)
            }}
            showControls
          />
        </Card>
      )}
    </Space>
  )
}
const Components: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item label="Components">
      <Form.List name="components">
        {(fields, { add, remove }) => (
          <Space direction="vertical" style={{ width: '100%' }}>
            {fields.map((field, index) => (
              <RowComponent
                key={field.name}
                form={form}
                field={field}
                remove={remove}
                disabled={disabled}
              />
            ))}

            <Button type="dashed" onClick={() => add()} style={{ width: '100%' }}>
              Add row
            </Button>
          </Space>
        )}
      </Form.List>
    </Form.Item>
  )
}
const RowComponent: React.FC<any> = ({ form, field: row, remove: removeRow, disabled }) => {
  return (
    <Card size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Form.List name={row.name}>
          {(fields, { add, remove }) => (
            <Space direction="vertical" style={{ width: '100%' }}>
              {fields.map((field) => (
                <Component
                  key={field.name}
                  form={form}
                  row={row}
                  field={field}
                  remove={remove}
                  disabled={disabled}
                />
              ))}

              <Flex gap={8}>
                <Button type="dashed" style={{ flex: 1 }} onClick={() => add()}>
                  Add component
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => removeRow(row.name)}
                  disabled={disabled}
                >
                  <DeleteOutlined />
                </Button>
              </Flex>
            </Space>
          )}
        </Form.List>
      </Space>
    </Card>
  )
}
const Component: React.FC<any> = ({ form, row, field, remove, disabled }) => {
  const [isNestedFormOpen, setIsNestedFormOpen] = useState<boolean>(false)

  const { data: components, isLoading: isComponentsLoading } = useGetMessageComponentsQuery()

  const componentId = Form.useWatch(['components', row.name, field.name], form)

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Flex key={field.name} gap={8}>
        <Form.Item
          style={{ flex: 1 }}
          noStyle
          name={field.name}
          rules={[{ required: true, message: '' }]}
        >
          <Select
            showSearch
            allowClear
            disabled={disabled || isNestedFormOpen}
            loading={isComponentsLoading}
            options={components?.map((component) => ({
              value: component._id,
              label: component.name || component._id,
            }))}
            placeholder="Component..."
          />
        </Form.Item>
        <Tooltip title="Remove component (will not be deleted)">
          <Button type="primary" danger onClick={() => remove(field.name)} disabled={disabled}>
            <DeleteOutlined />
          </Button>
        </Tooltip>
        <Button
          type="primary"
          onClick={() => setIsNestedFormOpen(true)}
          disabled={disabled || isNestedFormOpen}
        >
          {componentId ? <EditOutlined /> : <PlusOutlined />}
        </Button>
      </Flex>

      {isNestedFormOpen && (
        <Card size="small">
          <EditMessageComponentForm
            component={componentId}
            onFinish={(value) => {
              setIsNestedFormOpen(false)
              form.setFieldValue(['components', row.name, field.name], value?._id)
            }}
            onAbort={() => {
              setIsNestedFormOpen(false)
            }}
            showControls
          />
        </Card>
      )}
    </Space>
  )
}
