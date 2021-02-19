import { FC, useEffect, useState } from 'react'
import { not } from 'ramda'
import { minimize } from '../utils'

interface HamburgerProps {
  onChange: (isActive: boolean) => void
  type: string
}

const Hamburger: FC<Partial<HamburgerProps>> = ({
  onChange,
  type = 'slider',
}) => {
  const [isActive, setActive] = useState(false)

  useEffect(() => {
    onChange?.(isActive)
  }, [isActive])

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

export default Hamburger
