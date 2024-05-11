import { IAction } from '@bot/models/action'
import { SkynetEvents } from '@bot/models/event'
import { EditFormProps } from '@components/Form'
import { EditCategoryForm } from '@components/Form/EditCategoryForm'
import {
  useAddActionMutation,
  useEditActionMutation,
  useGetActionQuery,
} from '@modules/api/action/action.api'
import { useGetCategoriesQuery } from '@modules/api/category/category.api'
import { useGetPermissionsFlagsBitsQuery } from '@modules/api/permission/permission.api'
import { executable } from '@modules/lib/executable'
import { splitByUpperCase } from '@utils/helpers/splitByUpperCase'
import { toBinaryNumbers } from '@utils/helpers/toBinaryNumbers'
import { toTitleCase } from '@utils/helpers/toTitleCase'
import { Button, Card, Flex, Form, FormInstance, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'

export interface EditActionFormProps extends EditFormProps {
  action?: IAction['_id']
  onFinish?: (value?: IAction) => void
}

export const EditActionForm: React.FC<EditActionFormProps> = ({
  form: _form,
  action: actionId,
  onFinish,
  onFinishFailed,
  onAbort,
  showControls,
  ...props
}) => {
  const [form] = Form.useForm(_form)

  const { data: action } = useGetActionQuery(actionId, { skip: !actionId })

  const [addAction] = useAddActionMutation()
  const [editAction] = useEditActionMutation()

  const handleFinish = async (fields: any) => {
    try {
      const { permissions, ...rest } = fields

      const totalPermissions = permissions.reduce(
        (sum: number, value: string) => (sum += Number(value)),
        0
      )

      const response = action
        ? await editAction({ id: action._id, permissions: totalPermissions, ...rest })
        : await addAction({ permissions: totalPermissions, ...rest })

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
  }, [form, actionId, action])

  return (
    <Form
      initialValues={{
        name: action?.name,
        description: action?.description,
        event: action?.event,
        category: action?.category,
        cooldown: action?.cooldown ?? 5,
        // testOnly: action?.testOnly ?? false, // TODO: only for developers team
        // devsOnly: action?.devsOnly ?? false, // TODO: only for developers team
        permissions: toBinaryNumbers(action?.permissions).map((value) => value.toString()),
        execute: action?.execute.toString(),
      }}
      onFinish={handleFinish}
      form={form}
      layout="vertical"
      {...props}
    >
      <Name form={form} action={action} />
      <Description form={form} action={action} />
      <Category form={form} action={action} />
      <Event form={form} action={action} />
      <Permissions form={form} action={action} />
      <Cooldown form={form} action={action} />
      {/* TODO: DevsOnly and testOnly radio buttons row (only for members of dev server with required role) */}
      <Execute form={form} action={action} />

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

interface EditActionFormItem {
  form: FormInstance
  action?: IAction
}

const Name: React.FC<EditActionFormItem> = ({ form, action }) => {
  return (
    <Form.Item label="Name" name="name">
      <Input placeholder="Name..." />
    </Form.Item>
  )
}
const Description: React.FC<EditActionFormItem> = ({ form, action }) => {
  return (
    <Form.Item label="Description" name="description">
      <Input.TextArea rows={3} placeholder="Description..." />
    </Form.Item>
  )
}
const Category: React.FC<EditActionFormItem> = ({ form, action }) => {
  const [categoryForm] = Form.useForm()

  const [isNestedFormOpen, setIsNestedFormOpen] = useState<boolean>(false)

  const { data: categories } = useGetCategoriesQuery()

  const categoryId = Form.useWatch('category', form)

  return (
    <>
      <Form.Item label="Category" name="category">
        <Flex gap={8}>
          <Select
            allowClear
            showSearch
            value={categoryId}
            onChange={(value: string) => form.setFieldValue('category', value)}
            onClear={() => form.setFieldValue('category', undefined)}
            disabled={isNestedFormOpen}
            placeholder="Category..."
            options={categories?.map((category) => ({
              label: category.emoji ? `${category.emoji} ${category.name}` : category.name,
              value: category._id,
            }))}
          />
          <Button
            type="primary"
            onClick={() => setIsNestedFormOpen(true)}
            disabled={isNestedFormOpen}
          >
            {categoryId ? 'Edit' : 'Create'}
          </Button>
        </Flex>
      </Form.Item>

      {isNestedFormOpen && (
        <Form.Item>
          <EditCategoryForm
            component={Card}
            form={categoryForm}
            category={categoryId}
            onFinish={(value) => {
              form.setFieldValue('category', value?._id)
              setIsNestedFormOpen(false)
            }}
            onAbort={() => {
              setIsNestedFormOpen(false)
            }}
            showControls
          />
        </Form.Item>
      )}
    </>
  )
}
const Event: React.FC<EditActionFormItem> = ({ form, action }) => {
  return (
    <Form.Item
      label="Event"
      name="event"
      required
      rules={[{ required: true, message: 'Required' }]}
    >
      <Select
        allowClear
        showSearch
        placeholder="Event..."
        disabled={!!action}
        options={Object.values(SkynetEvents)
          .filter((skynetEvent) => skynetEvent)
          .map((skynetEvent) => ({
            label: skynetEvent
              .split('-')
              .map((word) => toTitleCase(word))
              .join(' '),
            value: skynetEvent,
          }))}
      />
    </Form.Item>
  )
}
const Permissions: React.FC<EditActionFormItem> = ({ form, action }) => {
  const { data: permissionFlagsBits } = useGetPermissionsFlagsBitsQuery()

  return (
    <Form.Item label="Permissions" name="permissions">
      <Select
        mode="tags"
        allowClear
        showSearch
        placeholder="Permissions..."
        options={Object.entries(
          Object.keys(permissionFlagsBits || {}).reduce((acc: any, key) => {
            const value = (permissionFlagsBits as any)?.[key]
            acc[value] = acc[value] || []
            acc[value].push(key)
            return acc
          }, {})
        ).map(([value, names]) => ({
          value: value,
          label: (names as string[]).map((name) => splitByUpperCase(name).join(' ')).join(' and '),
        }))}
      />
    </Form.Item>
  )
}
const Cooldown: React.FC<EditActionFormItem> = ({ form, action }) => {
  return (
    <Form.Item
      label="Cooldown"
      name="cooldown"
      required
      rules={[
        {
          validator: (_, value) => {
            if (value < 5) {
              return Promise.reject(new Error('Min = 5'))
            }

            if (value > 100) {
              return Promise.reject(new Error('Max  = 100'))
            }

            return Promise.resolve()
          },
        },
      ]}
    >
      <Input type="number" min={5} max={100} suffix="s" />
    </Form.Item>
  )
}
const Execute: React.FC<EditActionFormItem> = ({ form, action }) => {
  const event = Form.useWatch('event', form)

  useEffect(() => {
    form.setFieldValue(
      'execute',
      action?.execute.toString() ??
        (event && event in executable ? (executable as any)[event] : undefined)
    )
  }, [form, action, event])

  return (
    <Form.Item
      label="Function"
      name="execute"
      required
      rules={[
        {
          validator: (_, value) => {
            if (value === null || !value) {
              return Promise.reject(new Error('Required'))
            }

            try {
              new Function(`return ${value}`)()
            } catch (error) {
              return Promise.reject(new Error('Failed to parse into executable'))
            }

            return Promise.resolve()
          },
        },
      ]}
    >
      <Input.TextArea rows={8} placeholder="Function..." />
    </Form.Item>
  )
}