/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { not } from 'ramda'
import { FC, useEffect, useState } from 'react'
import styles from '../styles/ThemeSwitch.module.sass'

interface ThemeSwitchProps {
  onChange: (isActive: boolean) => void
  value: boolean
}

const ThemeSwitch: FC<Partial<ThemeSwitchProps>> = ({
  value = false,
  onChange = () => {},
}) => {
  const [active, setActive] = useState(value)

  const handler = () => {
    setActive(not)
    onChange(!active)
  }

  useEffect(() => {
    setActive(value)
  }, [value])

  return (
    <span
      onClick={handler}
      className={`cursor-pointer ${styles.btn} ${
        active && styles['btn--active']
      }`}
    />
  )
}

export default ThemeSwitch
