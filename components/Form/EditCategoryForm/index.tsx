import { ICategory } from '@bot/models/category'
import { EditFormProps } from '@components/Form'
import {
  useAddCategoryMutation,
  useEditCategoryMutation,
  useGetCategoryQuery,
} from '@modules/api/category/category.api'
import { Button, Flex, Form, FormInstance, Input, Select } from 'antd'
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

  const { data: category } = useGetCategoryQuery(categoryId, { skip: !categoryId })

  const isGlobal = !!category && category._id.startsWith('global-')

  const [addCategory] = useAddCategoryMutation()
  const [editCategory] = useEditCategoryMutation()

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
      <EmojiAndName form={form} category={category} disabled={isGlobal} />
      <Description form={form} category={category} disabled={isGlobal} />

      {showControls && (
        <Flex justify="end" gap={8}>
          {isGlobal ? (
            <Button type="primary" onClick={handleAbort}>
              Close
            </Button>
          ) : (
            <>
              <Button type="default" onClick={handleAbort}>
                Discard
              </Button>
              <Button type="primary" onClick={form.submit}>
                Save
              </Button>
            </>
          )}
        </Flex>
      )}
    </Form>
  )
}

interface EditCategoryFormItem {
  form: FormInstance
  category?: ICategory
  disabled?: boolean
}

const EmojiAndName: React.FC<EditCategoryFormItem> = ({ form, category, disabled }) => {
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
const Description: React.FC<EditCategoryFormItem> = ({ form, category, disabled }) => {
  return (
    <Form.Item label="Description" name="description">
      <Input.TextArea disabled={disabled} rows={3} placeholder="Description..." />
    </Form.Item>
  )
}
