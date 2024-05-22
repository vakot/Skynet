import { DeleteOutlined, EditOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons'
import { SkynetEvents } from '@bot/models/event'
import { IListener } from '@bot/models/listener'
import { IMessage } from '@bot/models/message'
import { EditFormItemProps, EditFormProps } from '@components/Form'
import { EditEmbedForm } from '@components/Form/EditEmbedForm'
import { SendMessageForm } from '@components/Form/SendMessageForm'
import { useGetEmbedsQuery } from '@modules/api/embed/embed.api'
import { useGetListenersQuery } from '@modules/api/listener/listener.api'
import {
  useAddMessageMutation,
  useEditMessageMutation,
  useGetMessageQuery,
} from '@modules/api/message/message.api'
import {
  Button,
  Card,
  Dropdown,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Tooltip,
  theme,
} from 'antd'
import { useEffect, useMemo, useState } from 'react'

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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

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
          <Button type="default" onClick={handleAbort} loading={isLoading} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="primary" onClick={form.submit} loading={isLoading} disabled={isLoading}>
            Save
          </Button>
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            loading={isLoading}
            disabled={isLoading || !messageId || !message}
          >
            Send <SendOutlined />
          </Button>
        </Flex>
      )}

      <Modal
        title="Send message"
        open={isModalOpen}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
      >
        <SendMessageForm
          message={messageId}
          onFinish={() => setIsModalOpen(false)}
          onAbort={() => setIsModalOpen(false)}
        />
      </Modal>
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

            <Button type="dashed" onClick={() => add()} block>
              Add embed
            </Button>
          </Space>
        )}
      </Form.List>
    </Form.Item>
  )
}
const Embed: React.FC<any> = ({ form, field, remove, disabled }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

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
            disabled={disabled || isModalOpen}
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
          onClick={() => setIsModalOpen(true)}
          disabled={disabled || isModalOpen}
        >
          {embedId ? <EditOutlined /> : <PlusOutlined />}
        </Button>
      </Flex>

      <Modal
        title={embedId ? 'Edit embed modal' : 'Create embed modal'}
        open={isModalOpen}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
      >
        <EditEmbedForm
          embed={embedId}
          onFinish={(value) => {
            setIsModalOpen(false)
            form.setFieldValue(['embeds', field.name], value?._id)
          }}
          onAbort={() => setIsModalOpen(false)}
          showControls
        />
      </Modal>
    </Space>
  )
}
const Components: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item label="Components">
      <Form.List name="components">
        {(fields, { add, remove }) => (
          <Space direction="vertical" style={{ width: '100%' }}>
            {fields.map((field) => (
              <RowComponent
                key={field.name}
                form={form}
                disabled={disabled}
                row={field}
                remove={remove}
              />
            ))}

            <Button type="dashed" onClick={() => add()} block>
              Add row
            </Button>
          </Space>
        )}
      </Form.List>
    </Form.Item>
  )
}
const RowComponent: React.FC<EditFormItemProps & { row: any; remove: (index: any) => void }> = ({
  form,
  row,
  remove: rowRemove,
  disabled,
}) => {
  const type: number | undefined = Form.useWatch(['components', row.name, 'type'], form)

  return (
    <Card key={row.name} size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex gap={8}>
          <Form.Item name={[row.name, 'type']} noStyle style={{ width: '100%' }}>
            <Select
              allowClear
              showSearch
              disabled={disabled}
              placeholder="Row type..."
              optionFilterProp="label"
              options={[
                {
                  value: 1,
                  label: 'Select menu',
                },
                {
                  value: 2,
                  label: "Button's",
                },
              ]}
            />
          </Form.Item>

          <Button type="primary" danger onClick={() => rowRemove(row.name)} disabled={disabled}>
            <DeleteOutlined />
          </Button>
        </Flex>

        {type === 1 ? (
          <SelectMenuComponent form={form} disabled={disabled} row={row} />
        ) : type === 2 ? (
          <ButtonsComponent form={form} disabled={disabled} row={row} />
        ) : null}
      </Space>
    </Card>
  )
}
const SelectMenuComponent: React.FC<EditFormItemProps & { row: any }> = ({
  form,
  disabled,
  row,
}) => {
  return <>TODO: select menu costructor</>
}
const ButtonsComponent: React.FC<EditFormItemProps & { row: any }> = ({ form, disabled, row }) => {
  return (
    <Form.List name={[row.name, 'components']}>
      {(fields, { add, remove }) => (
        <Flex gap={8} wrap="wrap">
          {fields.map((field) => (
            <ButtonComponent
              key={field.name}
              form={form}
              disabled={disabled}
              row={row}
              field={field}
            />
          ))}

          <Button type="dashed" onClick={() => add()}>
            Add button
          </Button>
        </Flex>
      )}
    </Form.List>
  )
}
const ButtonComponent: React.FC<EditFormItemProps & { row: any; field: any }> = ({
  form,
  disabled,
  row,
  field,
}) => {
  const { token } = theme.useToken()

  const [open, setOpen] = useState<boolean>(false)

  const buttons: any[] | undefined = Form.useWatch(['components', row.name, 'components'], form)
  const isDisabled: boolean | undefined = Form.useWatch(
    ['components', row.name, 'components', field.name, 'disabled'],
    form
  )
  const style: number | undefined = Form.useWatch(
    ['components', row.name, 'components', field.name, 'style'],
    form
  )

  const { data: listeners, isLoading: isListenersLoading } = useGetListenersQuery({
    event: SkynetEvents.ButtonInteraction,
  })

  const filteredListeners = useMemo<IListener[]>(() => {
    const buttonCustomIds = buttons?.map((button) => button?.customId)
    return listeners?.filter(({ _id }) => !buttonCustomIds?.includes(_id.toString())) || []
  }, [buttons, listeners])

  return (
    <Dropdown
      open={open}
      destroyPopupOnHide
      dropdownRender={() => (
        <div
          style={{
            backgroundColor: token.colorBgElevated,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowSecondary,
            padding: token.padding,
            width: 600,
          }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Flex gap={8}>
              {style !== 5 && (
                <Form.Item name={[field.name, 'emoji']} noStyle>
                  <Input style={{ width: 120 }} disabled={disabled} placeholder="Emoji..." />
                </Form.Item>
              )}
              <Form.Item
                name={[field.name, 'style']}
                noStyle
                rules={[{ required: true, message: 'Required' }]}
              >
                <Select
                  options={[
                    { label: 'Primary', value: 1 },
                    { label: 'Secondary', value: 2 },
                    { label: 'Success', value: 3 },
                    { label: 'Danger', value: 4 },
                    { label: 'Link', value: 5 },
                  ]}
                  disabled={disabled}
                  placeholder="Style..."
                />
              </Form.Item>
              <Form.Item noStyle name={[field.name, 'disabled']}>
                <Button
                  // TODO: type visualise
                  type={isDisabled ? 'default' : 'primary'}
                  onClick={() =>
                    form.setFieldValue(
                      ['components', row.name, 'components', field.name, 'disabled'],
                      !isDisabled
                    )
                  }
                >
                  {isDisabled ? 'Disabled' : 'Enabled'}
                </Button>
              </Form.Item>
            </Flex>

            <Flex gap={8}>
              <Form.Item noStyle name={[field.name, 'label']}>
                <Input disabled={disabled} placeholder="Label..." />
              </Form.Item>

              {style === 5 ? (
                <Form.Item
                  noStyle
                  name={[field.name, 'url']}
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input type="url" disabled={disabled} placeholder="Link..." />
                </Form.Item>
              ) : (
                <Form.Item
                  noStyle
                  name={[field.name, 'customId']}
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Select
                    allowClear
                    showSearch
                    disabled={disabled || isListenersLoading}
                    loading={isListenersLoading}
                    placeholder="Listener..."
                    optionFilterProp="label"
                    options={filteredListeners?.map((listener) => ({
                      label: listener.name || listener._id,
                      value: listener._id,
                    }))}
                  />
                </Form.Item>
              )}
            </Flex>
          </Space>
        </div>
      )}
    >
      <Button
        type="primary"
        // onBlur={() => setOpen(false)} // TODO: prope blur handle
        onClick={() => setOpen(!open)}
      >
        Click to edit
      </Button>
    </Dropdown>
  )
}
