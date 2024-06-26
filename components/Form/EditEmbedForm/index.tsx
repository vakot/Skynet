import { BarsOutlined, DeleteOutlined } from '@ant-design/icons'
import { IEmbed } from '@bot/models/message'
import { EditFormItemProps, EditFormProps } from '@components/Form'
import {
  useAddEmbedMutation,
  useEditEmbedMutation,
  useGetEmbedQuery,
} from '@modules/api/embed/embed.api'
import { Button, Card, ColorPicker, Flex, Form, Input, Space } from 'antd'
import { useEffect } from 'react'

export interface EditEmbedFormProps extends EditFormProps {
  embed?: IEmbed['id']
  onFinish?: (value?: IEmbed) => void
}

export const EditEmbedForm: React.FC<EditEmbedFormProps> = ({
  form: _form,
  embed: embedId,
  onFinish,
  onFinishFailed,
  onAbort,
  showControls,
  ...props
}) => {
  const [form] = Form.useForm(_form)

  const { data: embed, isLoading: isEmbedLoading } = useGetEmbedQuery(embedId, { skip: !embedId })
  const [addEmbed, { isLoading: isAddLoading }] = useAddEmbedMutation()
  const [editEmbed, { isLoading: isEditLoading }] = useEditEmbedMutation()

  const isLoading = isEmbedLoading || isEditLoading || isAddLoading

  const handleFinish = async (fields: any) => {
    try {
      const formattedFields = {
        ...fields,
        color: fields.color
          ? typeof fields.color === 'string'
            ? fields.color
            : fields.color?.toHexString()
          : undefined,
      }

      const response = embed
        ? await editEmbed({ id: embed._id, ...formattedFields })
        : await addEmbed(formattedFields)

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
  }, [form, embedId, embed])

  return (
    <Form initialValues={embed} onFinish={handleFinish} form={form} layout="vertical" {...props}>
      <Title form={form} disabled={isLoading} />
      <Author form={form} disabled={isLoading} />
      <Images form={form} disabled={isLoading} />
      <Description form={form} disabled={isLoading} />
      <Fields form={form} disabled={isLoading} />
      <Footer form={form} disabled={isLoading} />

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

const Author: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item label="Author">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex gap={8}>
          <Form.Item name={['author', 'name']} noStyle style={{ flex: 1 }}>
            <Input placeholder="Name..." disabled={disabled} />
          </Form.Item>
          <Form.Item name={['author', 'url']} noStyle style={{ flex: 1 }}>
            <Input placeholder="URL..." disabled={disabled} />
          </Form.Item>
        </Flex>
        <Form.Item name={['author', 'icon_url']} noStyle>
          <Input placeholder="Image URL..." disabled={disabled} />
        </Form.Item>
      </Space>
    </Form.Item>
  )
}
const Title: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item label="Title">
      <Flex gap={8}>
        <Form.Item name="color" noStyle>
          <ColorPicker format="hex" />
        </Form.Item>
        <Form.Item name="title" noStyle style={{ flex: 1 }}>
          <Input placeholder="Title..." />
        </Form.Item>
        <Form.Item name="url" noStyle style={{ flex: 1 }}>
          <Input type="url" placeholder="URL..." />
        </Form.Item>
      </Flex>
    </Form.Item>
  )
}
const Images: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item label="Images">
      <Flex gap={8}>
        <Form.Item name={['thumbnail', 'url']} noStyle style={{ flex: 1 }}>
          <Input placeholder="Thumbnail URL..." />
        </Form.Item>
        <Form.Item name={['image', 'url']} noStyle style={{ flex: 1 }}>
          <Input placeholder="Image URL..." />
        </Form.Item>
      </Flex>
    </Form.Item>
  )
}
const Description: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item label="Description">
      <Flex gap={8}>
        <Form.Item name="description" noStyle style={{ flex: 1 }}>
          <Input.TextArea rows={4} placeholder="Description..." />
        </Form.Item>
      </Flex>
    </Form.Item>
  )
}
const Fields: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item label="Fields">
      <Form.List name="fields">
        {(fields, { add, remove }) => (
          <Space direction="vertical" style={{ width: '100%' }}>
            {fields.map((field, index) => (
              <Field
                key={field.name}
                form={form}
                field={field}
                remove={remove}
                disabled={disabled}
              />
            ))}
            <Button type="dashed" onClick={() => add()} style={{ width: '100%' }}>
              Add field
            </Button>
          </Space>
        )}
      </Form.List>
    </Form.Item>
  )
}
const Field: React.FC<any> = ({ form, field, remove, disabled }) => {
  const inline = Form.useWatch(['fields', field.name, 'inline'], form)

  return (
    <Card key={field.name} size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex gap={8}>
          <Form.Item
            style={{ width: '100%' }}
            name={[field.name, 'name']}
            rules={[{ required: true, message: '' }]}
            noStyle
          >
            <Input disabled={disabled} placeholder="Field name..." />
          </Form.Item>
          <Form.Item name={[field.name, 'inline']} noStyle>
            <Button
              disabled={disabled}
              type={inline ? 'primary' : 'dashed'}
              onClick={() => form.setFieldValue(['fields', field.name, 'inline'], !inline)}
            >
              <BarsOutlined />
            </Button>
          </Form.Item>

          <Button disabled={disabled} type="primary" danger onClick={() => remove(field.name)}>
            <DeleteOutlined />
          </Button>
        </Flex>

        <Form.Item name={[field.name, 'value']} rules={[{ required: true, message: '' }]} noStyle>
          <Input.TextArea rows={3} placeholder="Field value..." />
        </Form.Item>
      </Space>
    </Card>
  )
}
const Footer: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item label="Footer">
      <Flex gap={8}>
        <Form.Item name={['footer', 'text']} noStyle style={{ flex: 1 }}>
          <Input placeholder="Footer..." />
        </Form.Item>
        <Form.Item name={['footer', 'icon_url']} noStyle style={{ flex: 1 }}>
          <Input placeholder="Image URL..." />
        </Form.Item>
      </Flex>
    </Form.Item>
  )
}
