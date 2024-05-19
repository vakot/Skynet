import { EditFilled, PlusOutlined } from '@ant-design/icons'
import { SkynetEvents } from '@bot/models/event'
import { EditFormItemProps } from '@components/Form'
import { EditActionForm } from '@components/Form/EditActionForm'
import { useGetActionsQuery } from '@modules/api/action/action.api'
import { Button, Card, Flex, Form, Select, Space } from 'antd'
import React, { useState } from 'react'

export interface EditActionFormItemProps extends EditFormItemProps {
  name?: string | string[]
  label?: React.ReactNode
  placeholder?: string
  event?: SkynetEvents
}

export const EditActionFormItem: React.FC<EditActionFormItemProps> = ({
  form,
  name,
  label,
  placeholder,
  event,
  disabled,
}) => {
  const { data: actions, isLoading: isActionsLoading } = useGetActionsQuery({ event })

  const [isNestedFormOpen, setIsNestedFormOpen] = useState<boolean>(false)

  const actionId = Form.useWatch(name ?? 'action', form)

  return (
    <Form.Item label={label ?? 'Action'}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex gap={8}>
          <Form.Item noStyle name={name ?? 'action'} style={{ flex: 1 }}>
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              disabled={disabled || isActionsLoading || isNestedFormOpen}
              loading={isActionsLoading}
              placeholder={placeholder ?? 'Action...'}
              options={actions?.map((action) => ({
                label: action.name || action._id,
                value: action._id,
              }))}
            />
          </Form.Item>

          <Button
            type="primary"
            onClick={() => setIsNestedFormOpen(true)}
            disabled={disabled || isActionsLoading || isNestedFormOpen}
          >
            {actionId ? <EditFilled /> : <PlusOutlined />}
          </Button>
        </Flex>

        {isNestedFormOpen && (
          <Card size="small">
            <EditActionForm
              action={actionId}
              event={event}
              onFinish={(value) => {
                setIsNestedFormOpen(false)
                form.setFieldValue(name ?? 'action', value?._id)
              }}
              onAbort={() => {
                setIsNestedFormOpen(false)
              }}
              showControls
            />
          </Card>
        )}
      </Space>
    </Form.Item>
  )
}
