import { FormProps } from 'antd'

export interface EditFormProps
  extends Omit<
    FormProps,
    'children' | 'layout' | 'action' | 'onFinish' | 'onFinishFailed' | 'onAbort' | 'initialValues'
  > {
  onFinishFailed?: (error: any) => void
  onAbort?: () => void
  showControls?: boolean
}
