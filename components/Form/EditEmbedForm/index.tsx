import { BarsOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { IEmbed } from '@bot/models/embed'
import { EditFormProps } from '@components/Form'
import {
  useAddEmbedMutation,
  useEditEmbedMutation,
  useGetEmbedQuery,
} from '@modules/api/embed/embed.api'
import { Button, Card, ColorPicker, Flex, Form, FormInstance, Input, Space } from 'antd'
import React, { useEffect } from 'react'

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
      const response = embed
        ? await editEmbed({ id: embed._id, ...fields })
        : await addEmbed(fields)

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
    <Form
      initialValues={{
        name: embed?.name,
        description: embed?.description,
      }}
      onFinish={handleFinish}
      form={form}
      layout="vertical"
      {...props}
    >
      <Name form={form} embed={embed} />
      <Description form={form} embed={embed} />
      <EmbedAuthor form={form} embed={embed} />
      <EmbedTitle form={form} embed={embed} />
      <EmbedImages form={form} embed={embed} />
      <EmbedEmbed form={form} embed={embed} />
      <EmbedFields form={form} embed={embed} />
      <EmbedFooter form={form} embed={embed} />

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

const Name: React.FC<EditEmbedFormItem> = ({ form, embed, disabled }) => {
  return (
    <Form.Item label="Name" name="name">
      <Input placeholder="Name..." disabled={disabled} />
    </Form.Item>
  )
}
const Description: React.FC<EditEmbedFormItem> = ({ form, embed, disabled }) => {
  return (
    <Form.Item label="Description" name="description">
      <Input.TextArea rows={3} placeholder="Description..." disabled={disabled} />
    </Form.Item>
  )
}
const EmbedAuthor: React.FC<EditEmbedFormItem> = ({ form, embed, disabled }) => {
  return (
    <Form.Item label="Author">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex gap={8}>
          <Form.Item noStyle style={{ flex: 1 }}>
            <Input placeholder="Name..." disabled={disabled} />
          </Form.Item>
          <Form.Item noStyle style={{ flex: 1 }}>
            <Input placeholder="URL..." disabled={disabled} />
          </Form.Item>
        </Flex>
        <Form.Item noStyle>
          <Input placeholder="Image URL..." disabled={disabled} />
        </Form.Item>
      </Space>
    </Form.Item>
  )
}
const EmbedTitle: React.FC<EditEmbedFormItem> = ({ form, embed, disabled }) => {
  return (
    <Form.Item label="Title">
      <Flex gap={8}>
        <Form.Item noStyle>
          <ColorPicker />
        </Form.Item>
        <Form.Item noStyle style={{ flex: 1 }}>
          <Input placeholder="Title..." />
        </Form.Item>
        <Form.Item noStyle style={{ flex: 1 }}>
          <Input placeholder="URL..." />
        </Form.Item>
      </Flex>
    </Form.Item>
  )
}
const EmbedImages: React.FC<EditEmbedFormItem> = ({ form, embed, disabled }) => {
  return (
    <Form.Item label="Images">
      <Flex gap={8}>
        <Form.Item noStyle style={{ flex: 1 }}>
          <Input placeholder="Thumbnail URL..." />
        </Form.Item>
        <Form.Item noStyle style={{ flex: 1 }}>
          <Input placeholder="Image URL..." />
        </Form.Item>
      </Flex>
    </Form.Item>
  )
}
const EmbedEmbed: React.FC<EditEmbedFormItem> = ({ form, embed, disabled }) => {
  return (
    <Form.Item label="Embed">
      <Flex gap={8}>
        <Form.Item noStyle style={{ flex: 1 }}>
          <Input.TextArea rows={4} placeholder="Embed..." />
        </Form.Item>
      </Flex>
    </Form.Item>
  )
}
const EmbedFields: React.FC<EditEmbedFormItem> = ({ form, embed, disabled }) => {
  return (
    <Form.Item label="Fields">
      <Form.List name="fields">
        {(fields, { add, remove }) => (
          <Space direction="vertical" style={{ width: '100%' }}>
            {fields.map((field, index) => (
              <Card key={field.name} size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Flex gap={8}>
                    <Form.Item noStyle>
                      <Input placeholder="Field name..." />
                    </Form.Item>
                    <Button type="primary">
                      <BarsOutlined />
                    </Button>
                    <Button type="primary">
                      <EditOutlined />
                    </Button>
                    <Button type="primary" danger onClick={() => remove(index)}>
                      <DeleteOutlined />
                    </Button>
                  </Flex>

                  <Form.Item noStyle>
                    <Input.TextArea rows={3} placeholder="Field description..." />
                  </Form.Item>
                </Space>
              </Card>
            ))}

            <Button type="dashed" onClick={add} style={{ width: '100%' }}>
              Add field
            </Button>
          </Space>
        )}
      </Form.List>

      {/* Modal */}
    </Form.Item>
  )
}
const EmbedFooter: React.FC<EditEmbedFormItem> = ({ form, embed, disabled }) => {
  return (
    <Form.Item label="Footer">
      <Flex gap={8}>
        <Form.Item noStyle style={{ flex: 1 }}>
          <Input placeholder="Footer..." />
        </Form.Item>
        <Form.Item noStyle style={{ flex: 1 }}>
          <Input placeholder="Image URL..." />
        </Form.Item>
      </Flex>
    </Form.Item>
  )
}
