import { FormInstance, FormProps } from 'antd'

export interface EditFormProps
  extends Omit<
    FormProps,
    'children' | 'layout' | 'action' | 'onFinish' | 'onFinishFailed' | 'onAbort' | 'initialValues'
  > {
  onFinishFailed?: (error: any) => void
  onAbort?: () => void
  showControls?: boolean
}

export interface EditFormItemProps {
  form: FormInstance<any>
  disabled?: boolean
}
