import { SkynetEvents } from '@bot/models/event'
import { toTitleCase } from '@utils/helpers'
import { Select, SelectProps } from 'antd'
import { useMemo } from 'react'

export interface SelectEventProps
  extends Omit<SelectProps, 'allowClear' | 'showSearch' | 'placeholder' | 'options'> {}

export const SelectEvent: React.FC<SelectEventProps> = (props) => {
  const options = useMemo<any[]>(() => {
    return Object.values(SkynetEvents).map((skynetEvent) => ({
      label: skynetEvent
        .split('-')
        .map((word) => toTitleCase(word))
        .join(' '),
      value: skynetEvent,
    }))
  }, [])

  return (
    <Select
      allowClear
      showSearch
      placeholder="Event..."
      optionFilterProp="label"
      options={options}
      {...props}
    />
  )
}
