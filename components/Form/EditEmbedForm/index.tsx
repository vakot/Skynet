import { BarsOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { IEmbed } from '@bot/models/embed'
import { EditFormProps } from '@components/Form'
import {
  useAddEmbedMutation,
  useEditEmbedMutation,
  useGetEmbedQuery,
} from '@modules/api/embed/embed.api'
import { Button, Card, ColorPicker, Flex, Form, FormInstance, Input, Space } from 'antd'
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

  const { data: embed } = useGetEmbedQuery(embedId, { skip: !embedId })
  const [addEmbed] = useAddEmbedMutation()
  const [editEmbed] = useEditEmbedMutation()

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
      <Title form={form} embed={embed} />
      <Author form={form} embed={embed} />
      <Images form={form} embed={embed} />
      <Description form={form} embed={embed} />
      <Fields form={form} embed={embed} />
      <Footer form={form} embed={embed} />

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

interface EditEmbedFormItem {
  form: FormInstance
  embed?: IEmbed
  disabled?: boolean
}

const Author: React.FC<EditEmbedFormItem> = ({ form, embed, disabled }) => {
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
const Title: React.FC<EditEmbedFormItem> = ({ form, embed, disabled }) => {
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
const Images: React.FC<EditEmbedFormItem> = ({ form, embed, disabled }) => {
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
const Description: React.FC<EditEmbedFormItem> = ({ form, embed, disabled }) => {
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
const Fields: React.FC<EditEmbedFormItem> = ({ form, embed, disabled }) => {
  return (
    <Form.Item label="Fields">
      <Form.List name="fields">
        {(fields, { add, remove }) => (
          <Space direction="vertical" style={{ width: '100%' }}>
            {fields.map((field, index) => (
              <Field key={index} form={form} field={field} remove={remove} />
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
const Field: React.FC<any> = ({ form, field, remove }) => {
  const inline = Form.useWatch(['fields', field.name, 'inline'], form)

  return (
    <Card key={field.name} size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex gap={8}>
          <Form.Item
            style={{ flex: 1 }}
            name={[field.name, 'name']}
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input placeholder="Field name..." />
          </Form.Item>
          <Form.Item name={[field.name, 'inline']}>
            <Button
              type={inline ? 'primary' : 'dashed'}
              onClick={() => form.setFieldValue(['fields', field.name, 'inline'], !inline)}
            >
              <BarsOutlined />
            </Button>
          </Form.Item>

          <Button type="primary">
            <EditOutlined />
          </Button>
          <Button type="primary" danger onClick={() => remove(field.name)}>
            <DeleteOutlined />
          </Button>
        </Flex>

        <Form.Item name={[field.name, 'value']} rules={[{ required: true, message: 'Required' }]}>
          <Input.TextArea rows={3} placeholder="Field value..." />
        </Form.Item>
      </Space>
    </Card>
  )
}
const Footer: React.FC<EditEmbedFormItem> = ({ form, embed, disabled }) => {
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
