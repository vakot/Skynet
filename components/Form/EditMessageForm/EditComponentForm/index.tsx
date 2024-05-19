import { SkynetEvents } from '@bot/models/event'
import { IMessageComponent } from '@bot/models/message'
import { EditFormItemProps, EditFormProps } from '@components/Form'
import {
  useAddMessageComponentMutation,
  useEditMessageComponentMutation,
  useGetMessageComponentQuery,
} from '@modules/api/message/component/component.api'

import { Button, Card, Flex, Form, Input, Select } from 'antd'
import { useEffect } from 'react'

export interface EditMessageComponentFormProps extends EditFormProps {
  component?: IMessageComponent['_id']
  onFinish?: (value?: IMessageComponent) => void
}

export const EditMessageComponentForm: React.FC<EditMessageComponentFormProps> = ({
  form: _form,
  component: componentId,
  onFinish,
  onFinishFailed,
  onAbort,
  showControls,
  ...props
}) => {
  const [form] = Form.useForm(_form)

  const { data: component, isLoading: isComponentLoading } = useGetMessageComponentQuery(
    componentId,
    {
      skip: !componentId,
    }
  )
  const [addComponent, { isLoading: isAddLoading }] = useAddMessageComponentMutation()
  const [editComponent, { isLoading: isEditLoading }] = useEditMessageComponentMutation()

  const isLoading = isComponentLoading || isEditLoading || isAddLoading

  const handleFinish = async (fields: any) => {
    try {
      const response = component
        ? await editComponent({ id: component._id, ...fields })
        : await addComponent(fields)

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
  }, [form, componentId, component])

  return (
    <Form
      initialValues={{ ...component, type: SkynetEvents.ButtonInteraction }}
      onFinish={handleFinish}
      form={form}
      layout="vertical"
      {...props}
    >
      <Name form={form} disabled={isLoading} />
      <Description form={form} disabled={isLoading} />
      <Type form={form} disabled={isLoading || (!!componentId && !!component)} />
      <Data form={form} disabled={isLoading} />

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
const Type: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Required' }]}>
      <Select
        allowClear
        showSearch
        placeholder="Component type..."
        optionFilterProp="label"
        disabled={disabled || true} // TODO: select menu
        options={[{ label: 'Button', value: SkynetEvents.ButtonInteraction }]}
      />
    </Form.Item>
  )
}
const Data: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  const type = Form.useWatch('type', form)

  const InnerForm =
    type && type in MessageComponentsForms ? (MessageComponentsForms as any)[type] : null

  if (InnerForm) {
    return <InnerForm form={form} disabled={disabled} />
  }
}

const MessageComponentsForms: { [key: string]: React.FC<EditFormItemProps> } = {
  [SkynetEvents.ButtonInteraction]: ({ form, disabled }) => {
    const isDisabled = Form.useWatch('disabled', form)

    return (
      <Form.Item label="Button">
        <Card size="small">
          <Flex gap={8}>
            <Form.Item style={{ width: 80 }} label="Emoji" name={['component', 'emoji']}>
              <Input disabled={disabled} placeholder="Emoji..." />
            </Form.Item>
            <Form.Item style={{ flex: 1 }} label="Style">
              <Flex gap={8}>
                <Form.Item
                  style={{ flex: 1 }}
                  name={['component', 'style']}
                  noStyle
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Select
                    options={[
                      { label: 'Primary', value: 1 },
                      { label: 'Secondary', value: 2 },
                      { label: 'Success', value: 3 },
                      { label: 'Danger', value: 4 },
                    ]}
                    disabled={disabled}
                    placeholder="Style..."
                  />
                </Form.Item>
                <Form.Item name={['component', 'disabled']} noStyle>
                  <Button
                    // TODO: type visualise
                    type={isDisabled ? 'default' : 'primary'}
                    onClick={() => form.setFieldValue('disabled', !isDisabled)}
                  >
                    {isDisabled ? 'Disabled' : 'Enabled'}
                  </Button>
                </Form.Item>
              </Flex>
            </Form.Item>
          </Flex>

          <Form.Item label="Label" name={['component', 'label']}>
            <Input disabled={disabled} placeholder="Label..." />
          </Form.Item>

          {/* TODO: url type */}
        </Card>
      </Form.Item>
    )
  },
}
