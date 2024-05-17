import { SkynetEvents } from '@bot/models/event'
import { toTitleCase } from '@utils/helpers'
import { Select, SelectProps } from 'antd'

export interface SelectEventProps
  extends Omit<SelectProps, 'allowClear' | 'showSearch' | 'placeholder' | 'options'> {}

export const SelectEvent: React.FC<SelectEventProps> = (props) => {
  return (
    <Select
      allowClear
      showSearch
      placeholder="Event..."
      options={Object.values(SkynetEvents).map((skynetEvent) => ({
        label: skynetEvent
          .split('-')
          .map((word) => toTitleCase(word))
          .join(' '),
        value: skynetEvent,
      }))}
      {...props}
    />
  )
}
