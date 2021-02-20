import { PropsWithChildren } from 'react'
import Ripples from 'react-ripples'

function Button({ children }: PropsWithChildren<{}>) {
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
          className="
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
