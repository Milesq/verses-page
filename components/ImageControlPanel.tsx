import { PropsWithChildren } from 'react'
import Button from './Button'

export interface Option {
  label: string
  values: { label: string; value: string }[]
}

export type GetImageRef<T> = (data: Record<keyof T, string>) => string

export interface ControlPanelProps<T extends Record<string, Option>> {
  getImageRef: GetImageRef<T>
  controls: T & Record<string, Option>
}

function ImageControlPanel<T extends Record<string, Option>>({
  controls,
  getImageRef,
}: PropsWithChildren<ControlPanelProps<T>>) {
  const data = Object.fromEntries(
    Object.entries(controls).map(([name]) => [name, 'sd'])
  )

  return (
    <>
      <Button
        custom-colors
        className="
          bg-blue-600
          hover:bg-blue-500
          dark:hover:bg-blue-700"
      >
        Pobierz
      </Button>
      <img
        src={getImageRef(data)}
        alt="Board with the verse"
        className="
          w-3/4
          mx-auto
          mt-8
          rounded
          shadow

          hover:shadow-2xl
          transition-shadow
          duration-500
          ease-out
        "
      />
    </>
  )
}

export default ImageControlPanel
