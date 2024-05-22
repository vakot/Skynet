import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { IAction } from '@bot/models/action'
import { SkynetEvents } from '@bot/models/event'
import { EditFormItemProps, EditFormProps } from '@components/Form'
import { EditCategoryForm } from '@components/Form/EditCategoryForm'
import { SelectEvent } from '@components/UI/Select/SelectEvent'
import {
  useAddActionMutation,
  useEditActionMutation,
  useGetActionQuery,
} from '@modules/api/action/action.api'
import { useGetCategoriesQuery } from '@modules/api/category/category.api'
import { useGetGuildsQuery } from '@modules/api/guild/guild.api'
import { useGetPermissionsFlagsBitsQuery } from '@modules/api/permission/permission.api'
import { executable } from '@modules/lib/executable'
import { Editor } from '@monaco-editor/react'
import { splitByUpperCase } from '@utils/helpers'
import { toBinaryNumbers } from '@utils/helpers/toBinaryNumbers'
import { Button, Card, Flex, Form, Input, Modal, Select, Space } from 'antd'
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

      const totalPermissions = permissions?.reduce(
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
    if (action && actionId) {
      form.setFieldsValue({
        name: action?.name,
        description: action?.description,
        event: action?.event,
        category: action?.category,
        cooldown: action?.cooldown ?? 5,
        // testOnly: action?.testOnly ?? false, // TODO: only for developers team
        // devsOnly: action?.devsOnly ?? false, // TODO: only for developers team
        permissions: toBinaryNumbers(action?.permissions).map((value) => value.toString()),
        execute: action?.execute.toString(),
      })
    } else {
      form.resetFields()
    }
  }, [form, actionId, action])

  return (
    <Form onFinish={handleFinish} form={form} layout="vertical" {...props}>
      <Name form={form} disabled={isLoading} action={actionId} />
      <Description form={form} disabled={isLoading} action={actionId} />
      <Category form={form} disabled={isLoading} action={actionId} />
      <Event form={form} disabled={isLoading || (!!actionId && !!action)} action={actionId} />
      <Permissions form={form} disabled={isLoading} action={actionId} />
      <Cooldown form={form} disabled={isLoading} action={actionId} />
      {/* TODO: DevsOnly and testOnly radio buttons row (only for members of dev server with required role) */}

      <Execute form={form} disabled={isLoading} action={actionId} />

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

const Name: React.FC<EditFormItemProps & { action?: IAction['_id'] }> = ({
  form,
  disabled,
  action: actionId,
}) => {
  return (
    <Form.Item label="Name" name="name">
      <Input placeholder="Name..." disabled={disabled} />
    </Form.Item>
  )
}
const Description: React.FC<EditFormItemProps & { action?: IAction['_id'] }> = ({
  form,
  disabled,
  action: actionId,
}) => {
  return (
    <Form.Item label="Description" name="description">
      <Input.TextArea rows={3} placeholder="Description..." disabled={disabled} />
    </Form.Item>
  )
}
const Category: React.FC<EditFormItemProps & { action?: IAction['_id'] }> = ({
  form,
  disabled,
  action: actionId,
}) => {
  const [editCategoryForm] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const categoryId = Form.useWatch('category', form)

  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery()

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
              disabled={disabled || isModalOpen || isCategoriesLoading}
              optionFilterProp="label"
              options={categories?.map((category) => ({
                label: category.emoji ? `${category.emoji} ${category.name}` : category.name,
                value: category._id,
              }))}
            />
          </Form.Item>
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            loading={isCategoriesLoading}
            disabled={disabled || isModalOpen || isCategoriesLoading}
          >
            {categoryId ? <EditOutlined /> : <PlusOutlined />}
          </Button>
        </Flex>

        <Modal
          open={isModalOpen}
          okText="Save"
          cancelText="Cancel"
          onOk={() => {
            editCategoryForm.submit()
            setIsModalOpen(false)
          }}
          onCancel={() => {
            editCategoryForm.resetFields()
            setIsModalOpen(false)
          }}
          destroyOnClose
        >
          <EditCategoryForm
            category={categoryId}
            form={editCategoryForm}
            onFinish={(value) => form.setFieldValue('category', value?._id)}
          />
        </Modal>
      </Space>
    </Form.Item>
  )
}
const Event: React.FC<EditFormItemProps & { action?: IAction['_id'] }> = ({
  form,
  disabled,
  action: actionId,
}) => {
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
    <Form.Item required label="Event">
      <Form.Item noStyle name="event" rules={[{ required: true, message: 'Required' }]}>
        <SelectEvent disabled={disabled} />
      </Form.Item>

      {/* {event === SkynetEvents.CommandInteraction ? (
        <CommandInteraction form={form} disabled={disabled} action={actionId} />
      ) : null} */}
    </Form.Item>
  )
}
const CommandInteraction: React.FC<EditFormItemProps & { action?: IAction['_id'] }> = ({
  form,
  disabled,
  action: actionId,
}) => {
  const { data: guilds, isLoading: isGuildsLoading } = useGetGuildsQuery()

  return (
    <Card size="small">
      <Form.Item
        label="Name"
        name={['command', 'name']}
        rules={[{ required: true, message: 'Required' }]}
      >
        <Input placeholder="Name..." disabled={disabled} />
      </Form.Item>

      <Form.Item
        label="Description"
        name={['command', 'description']}
        rules={[{ required: true, message: 'Required' }]}
      >
        <Input.TextArea rows={3} placeholder="Description..." disabled={disabled} />
      </Form.Item>

      <Form.Item
        label="Guild"
        name={['command', 'guild']}
        rules={[{ required: true, message: 'Required' }]}
      >
        <Select
          showSearch
          allowClear
          disabled={disabled || isGuildsLoading}
          loading={isGuildsLoading}
          placeholder="Guild..."
          optionFilterProp="label"
          options={guilds?.map((guild) => ({
            value: guild.id,
            label: guild.name || guild.id,
          }))}
        />
      </Form.Item>
    </Card>
  )
}
const Permissions: React.FC<EditFormItemProps & { action?: IAction['_id'] }> = ({
  form,
  disabled,
  action: actionId,
}) => {
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
const Cooldown: React.FC<EditFormItemProps & { action?: IAction['_id'] }> = ({
  form,
  disabled,
  action: actionId,
}) => {
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
              return Promise.reject(new Error('Max = 100'))
            }

            return Promise.resolve()
          },
        },
      ]}
    >
      <Input
        type="number"
        placeholder="Cooldown..."
        min={5}
        max={100}
        suffix="s"
        disabled={disabled}
      />
    </Form.Item>
  )
}
const Execute: React.FC<EditFormItemProps & { action?: IAction['_id'] }> = ({
  form,
  disabled,
  action: actionId,
}) => {
  const execute: string | undefined = Form.useWatch('execute', form)
  const event: SkynetEvents | undefined = Form.useWatch('event', form)

  useEffect(() => {
    if (!disabled && !actionId) {
      form.setFieldValue(
        'execute',
        event
          ? event in executable
            ? (executable as any)[event]
            : '// default executable is not presented'
          : null
      )
    }
  }, [form, event, disabled, actionId])

  return (
    <Form.Item
      label="Execute"
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
      <Card size="small" onClick={(e) => (disabled || !event) && e.stopPropagation()}>
        <Editor
          height="520px" // just don't ask...
          language="typescript"
          theme="vs-light"
          value={execute || '// select event to start editing'}
          onChange={(value) => {
            form.setFieldValue('execute', value)
          }}
          options={{
            readOnly: disabled || !event,
            opacity: 0.5,
            inlineSuggest: true,
            fontSize: '14px',
            formatOnType: true,
            autoClosingBrackets: true,
            wordWrap: 'on',
          }}
        />
      </Card>
    </Form.Item>
  )
}
