/* eslint-disable react/destructuring-assignment */
import { PropsWithChildren, HTMLAttributes } from 'react'
import Ripples from 'react-ripples'

export type ButtonProps = PropsWithChildren<
  Partial<{
    containerClassName: string
    'custom-colors': boolean
  }>
> &
  HTMLAttributes<HTMLButtonElement>

function Button({
  children,
  containerClassName = '',
  'custom-colors': customColors,
  ...props
}: ButtonProps) {
  return (
    <div
      className={`
        ${containerClassName}
        rounded-full
        overflow-hidden
      `}
    >
      <Ripples>
        <button
          {...props}
          className={`
            disabled:bg-gray-400
            disabled:pointer-events-none


            ${props.className || ''}

            ${
              !customColors &&
              `
              bg-green-600
              hover:bg-green-500
              dark:hover:bg-green-700
            `
            }

            transition
            duration-150
            shadow
            hover:shadow-md
            text-white
            px-3 py-2
            rounded-full
            focus:outline-none
          `}
          type="submit"
        >
          {children}
        </button>
      </Ripples>
    </div>
  )
}

export default Button
