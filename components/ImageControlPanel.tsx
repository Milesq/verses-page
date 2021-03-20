import { PropsWithChildren } from 'react'

export interface Option {
  label: string
  values: { label: string; value: string }[]
}

export type GetImageRef<T> = (data: Record<keyof T, string>) => string

export interface ControlPanelProps<T extends Record<string, Option>> {
  getImageRef: GetImageRef<T>
  controls: T & Record<string, Option>
}

function ImageControlPanel<T extends Record<string, Option>>(
  props: PropsWithChildren<ControlPanelProps<T>>
) {
  return <div>Hello World!</div>
}

export default ImageControlPanel
