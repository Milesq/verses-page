import { PropsWithChildren, HTMLAttributes } from 'react'
import Ripples from 'react-ripples'

function Button({
  children,
  disabled,
  ...props
}: PropsWithChildren<{ disabled?: boolean }> &
  HTMLAttributes<HTMLButtonElement>) {
  return (
    <div
      className="
        float-right
        rounded-full
        overflow-hidden
      "
    >
      <Ripples>
        <button
          {...props}
          disabled={disabled}
          className="
            disabled:bg-gray-400
            disabled:pointer-events-none

            transition
            duration-150
            bg-green-600
            hover:bg-green-500
            dark:hover:bg-green-700
            shadow
            hover:shadow-md
            text-white
            px-3 py-2
            rounded-full
            focus:outline-none
          "
          type="submit"
        >
          {children}
        </button>
      </Ripples>
    </div>
  )
}

export default Button
