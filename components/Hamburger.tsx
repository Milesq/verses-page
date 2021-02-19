import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { not } from 'ramda'
import { minimize } from '../utils'

interface HamburgerProps {
  onChange(isActive: boolean): void
  type: string
}

interface PublicMethods {
  close(): void
  open(): void
}

const Hamburger: ForwardRefRenderFunction<
  PublicMethods,
  Partial<HamburgerProps>
> = ({ onChange, type = 'slider' }, ref) => {
  const [isActive, setActive] = useState(false)

  useEffect(() => {
    onChange?.(isActive)
  }, [isActive])

  useImperativeHandle(ref, () => ({
    close() {
      setActive(false)
    },
    open() {
      setActive(true)
    },
  }))

  return (
    <button
      className={minimize`
        focus-visible:ring
        focus:outline-none
        hamburger
        hamburger--${type}
        ${isActive ? 'is-active' : ''}
      `}
      type="button"
      onClick={() => setActive(not)}
    >
      <span className="hamburger-box">
        <span className="hamburger-inner" />
      </span>
    </button>
  )
}

export default forwardRef(Hamburger)
