import { PropsWithChildren, useRef } from 'react'
import Swal from 'sweetalert2'
import { LabeledValue } from '../utils'
import Button from './Button'
import Radio from './Radio'

export interface Option {
  label: string
  defaultValue: string
  values: LabeledValue[]
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
  const defaultData = Object.fromEntries(
    Object.entries(controls).map(([name, { defaultValue }]) => [
      name,
      defaultValue,
    ])
  ) as Record<keyof typeof controls, string>
  const data = useRef(defaultData)

  async function getImage(): Promise<{ blob: Blob; fileName: string }> {
    const resp = await fetch(getImageRef(data.current))
    const blob = await resp.blob()
    const fileName = decodeURIComponent(resp.headers.get('X-Filename'))

    if (resp.headers.get('content-type').startsWith('application/json')) {
      throw new Error('server offline')
    }

    return {
      fileName,
      blob,
    }
  }

  async function share() {
    const { blob, fileName } = await getImage()

    const file = new File([blob], fileName, { type: blob.type })

    await (navigator.share as any)({
      url: window.location.origin + getImageRef,
      title: 'Wygeneruj planszę z biblijnym wersetem',
      text: 'Odwiedź bible-verse.vercel.app',
      files: [file],
    })
  }

  async function download() {
    try {
      const { blob, fileName } = await getImage()

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = fileName
      document.body.appendChild(a)

      a.click()
      URL.revokeObjectURL(url)
    } catch {
      Swal.fire('Oops...', 'Brak połączenia z serwerem', 'error')
    }
  }

  return (
    <>
      <div className="bg-gray-300 dark:border-gray-900 border w-full my-10" />

      <div className="flex items-center justify-between mb-8 flex-col-reverse gap-3 sm:gap-0 sm:flex-row">
        {Object.entries(controls).map(
          ([name, { label, values, defaultValue }]) => (
            <Radio
              key={name}
              label={label}
              values={values}
              defaultValue={defaultValue}
              // eslint-disable-next-line no-return-assign
              onChange={newVal => ((data.current as any)[name] = newVal)}
            />
          )
        )}

        <div className="flex gap-2">
          <Button
            onClick={download}
            custom-colors
            className="
          bg-blue-600
          hover:bg-blue-500
          dark:hover:bg-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </Button>
          {navigator.share && (
            <Button
              onClick={share}
              custom-colors
              className="
              bg-blue-600
              hover:bg-blue-500
              dark:hover:bg-blue-700
            "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 50.67 64"
              >
                <g>
                  <path d="M40,42.67a10.74,10.74,0,0,0-7.6,3.17L20,37.15a10.64,10.64,0,0,0,0-10.3l12.4-8.69a10.67,10.67,0,1,0-3.07-7.49,10.6,10.6,0,0,0,.4,2.88L16.29,23a10.41,10.41,0,0,0-5.62-1.63,10.67,10.67,0,0,0,0,21.34A10.41,10.41,0,0,0,16.29,41l13.44,9.41A10.67,10.67,0,1,0,40,42.67ZM40,5.33A5.34,5.34,0,0,1,40,16a5.24,5.24,0,0,1-3.2-1.09A5.32,5.32,0,0,1,40,5.33ZM15.57,34.05A5.27,5.27,0,0,1,11,37.31a1.32,1.32,0,0,1-.29,0,5.33,5.33,0,1,1,0-10.66,1.32,1.32,0,0,1,.29,0A5.27,5.27,0,0,1,15.57,30a5.1,5.1,0,0,1,0,4.1ZM40,58.67a5.32,5.32,0,0,1-3.2-9.58A5.24,5.24,0,0,1,40,48a5.34,5.34,0,0,1,0,10.67Z" />
                </g>
              </svg>
            </Button>
          )}
        </div>
      </div>
      <img
        src={getImageRef(data.current)}
        alt="Board with the verse"
        className="
          md:w-3/4
          mx-auto
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
