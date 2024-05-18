import { ICategory } from '@bot/models/category'
import { EditFormItemProps, EditFormProps } from '@components/Form'
import {
  useAddCategoryMutation,
  useEditCategoryMutation,
  useGetCategoryQuery,
} from '@modules/api/category/category.api'
import { Button, Flex, Form, Input, Select } from 'antd'
import EmojiPicker from 'emoji-picker-react'
import { useEffect } from 'react'

export interface EditCategoryFormProps extends EditFormProps {
  category?: ICategory['_id']
  onFinish?: (value?: ICategory) => void
}

export const EditCategoryForm: React.FC<EditCategoryFormProps> = ({
  form: _form,
  category: categoryId,
  onFinish,
  onFinishFailed,
  onAbort,
  showControls,
  ...props
}) => {
  const [form] = Form.useForm(_form)

  const { data: category, isLoading: isCategoryLoading } = useGetCategoryQuery(categoryId, {
    skip: !categoryId,
  })
  const [addCategory, { isLoading: isAddLoading }] = useAddCategoryMutation()
  const [editCategory, { isLoading: isEditLoading }] = useEditCategoryMutation()

  const isLoading = isCategoryLoading || isEditLoading || isAddLoading
  const isGlobal = !!category && category._id.startsWith('global-')

  const handleFinish = async (fields: any) => {
    if (isGlobal) {
      return onFinish?.(category)
    }

    try {
      const response = category
        ? await editCategory({ id: category._id, ...fields })
        : await addCategory(fields)

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
  }, [form, categoryId, category])

  return (
    <Form
      initialValues={{
        name: category?.name,
        emoji: category?.emoji,
        description: category?.description,
      }}
      onFinish={handleFinish}
      form={form}
      layout="vertical"
      {...props}
    >
      <EmojiAndName form={form} disabled={isLoading || isGlobal} />
      <Description form={form} disabled={isLoading || isGlobal} />

      {showControls && (
        <Flex justify="end" gap={8}>
          <Button type="default" onClick={handleAbort} disabled={isLoading}>
            Discard
          </Button>
          <Button type="primary" onClick={form.submit} disabled={isLoading || isGlobal}>
            Save
          </Button>
        </Flex>
      )}
    </Form>
  )
}

const EmojiAndName: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Flex gap={8}>
      <Form.Item label="Emoji" name="emoji" style={{ width: 100 }}>
        <Select
          disabled={disabled}
          placeholder="Emoji..."
          dropdownStyle={{ width: 'auto' }}
          dropdownRender={() => (
            <EmojiPicker
              onEmojiClick={({ emoji }) => {
                form.setFieldValue('emoji', emoji)
              }}
            />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Name"
        name="name"
        style={{ width: '100%' }}
        rules={[{ required: true, message: 'Required' }]}
      >
        <Input disabled={disabled} placeholder="Name..." />
      </Form.Item>
    </Flex>
  )
}
const Description: React.FC<EditFormItemProps> = ({ form, disabled }) => {
  return (
    <Form.Item label="Description" name="description">
      <Input.TextArea disabled={disabled} rows={3} placeholder="Description..." />
    </Form.Item>
  )
}
