import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { IAction } from '@bot/models/action'
import { EditFormItemProps, EditFormProps } from '@components/Form'
import { EditCategoryForm } from '@components/Form/EditCategoryForm'
import { SelectEvent } from '@components/UI/Select/SelectEvent'
import {
  useAddActionMutation,
  useEditActionMutation,
  useGetActionQuery,
} from '@modules/api/action/action.api'
import { useGetCategoriesQuery } from '@modules/api/category/category.api'
import { useGetPermissionsFlagsBitsQuery } from '@modules/api/permission/permission.api'
import { executable } from '@modules/lib/executable'
import { splitByUpperCase } from '@utils/helpers'
import { toBinaryNumbers } from '@utils/helpers/toBinaryNumbers'
import { Button, Card, Flex, Form, Input, Select, Space } from 'antd'
import { useEffect, useMemo, useState } from 'react'

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

  const { data: action, isLoading: isActionLoading } = useGetActionQuery(actionId, {
    skip: !actionId,
  })
  const [addAction, { isLoading: isAddLoading }] = useAddActionMutation()
  const [editAction, { isLoading: isEditLoading }] = useEditActionMutation()

  const isLoading = isActionLoading || isEditLoading || isAddLoading

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
      <Name form={form} disabled={isLoading} />
      <Description form={form} disabled={isLoading} />
      <Category form={form} disabled={isLoading} />
      <Event form={form} disabled={isLoading || (!!actionId && !!action)} />
      <Permissions form={form} disabled={isLoading} />
      <Cooldown form={form} disabled={isLoading} />
      {/* TODO: DevsOnly and testOnly radio buttons row (only for members of dev server with required role) */}
      <Execute form={form} disabled={isLoading} />

      {showControls && (
        <Flex justify="end" gap={8}>
          <Button type="default" onClick={handleAbort} disabled={isLoading}>
            Discard
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
const Category: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  const [isNestedFormOpen, setIsNestedFormOpen] = useState<boolean>(false)

  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery()

  const categoryId = Form.useWatch('category', form)

  return (
    <Form.Item label="Category">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex gap={8}>
          <Form.Item noStyle name="category">
            <Select
              allowClear
              showSearch
              placeholder="Category..."
              loading={isCategoriesLoading}
              disabled={disabled || isNestedFormOpen || isCategoriesLoading}
              optionFilterProp="label"
              options={categories?.map((category) => ({
                label: category.emoji ? `${category.emoji} ${category.name}` : category.name,
                value: category._id,
              }))}
            />
          </Form.Item>
          <Button
            type="primary"
            onClick={() => setIsNestedFormOpen(true)}
            loading={isCategoriesLoading}
            disabled={disabled || isNestedFormOpen || isCategoriesLoading}
          >
            {categoryId ? <EditOutlined /> : <PlusOutlined />}
          </Button>
        </Flex>

        {isNestedFormOpen && (
          <Card size="small">
            <EditCategoryForm
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
          </Card>
        )}
      </Space>
    </Form.Item>
  )
}
const Event: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  const event = Form.useWatch('event', form)

  useEffect(() => {
    if (!disabled) {
      if (event && event in executable) {
        form.setFieldValue('execute', (executable as any)[event])
      } else {
        form.setFieldValue('execute', undefined)
      }
    }
  }, [form, event, disabled])

  return (
    <Form.Item label="Event" name="event" rules={[{ required: true, message: 'Required' }]}>
      <SelectEvent disabled={disabled} />
    </Form.Item>
  )
}
const Permissions: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  const { data: permissionFlagsBits, isLoading: isPermissionFlagsBitsLoading } =
    useGetPermissionsFlagsBitsQuery()

  const permissionFlagsBitsCollection = useMemo<any[]>(() => {
    return Object.entries(
      Object.keys(permissionFlagsBits || {}).reduce((acc: any, key) => {
        const value = (permissionFlagsBits as any)?.[key]
        acc[value] = acc[value] || []
        acc[value].push(key)
        return acc
      }, {})
    )
  }, [permissionFlagsBits])

  return (
    <Form.Item label="Permissions" name="permissions">
      <Select
        mode="multiple"
        allowClear
        showSearch
        loading={isPermissionFlagsBitsLoading}
        disabled={disabled || isPermissionFlagsBitsLoading}
        placeholder="Permissions..."
        optionFilterProp="label"
        options={permissionFlagsBitsCollection.map(([value, names]) => ({
          label: (names as string[]).map((name) => splitByUpperCase(name).join(' ')).join(' and '),
          value: value,
        }))}
      />
    </Form.Item>
  )
}
const Cooldown: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item
      label="Cooldown"
      name="cooldown"
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
      <Input type="number" min={5} max={100} suffix="s" disabled={disabled} />
    </Form.Item>
  )
}
const Execute: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item
      label="Function"
      name="execute"
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
      <Input.TextArea rows={8} placeholder="Function..." disabled={disabled} />
    </Form.Item>
  )
}
