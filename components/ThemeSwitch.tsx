/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { FC, useState } from 'react'
import styles from '../styles/ThemeSwitch.module.sass'

interface ThemeSwitchProps {
  onChange?: (isActive: boolean) => void
}

const ThemeSwitch: FC<ThemeSwitchProps> = ({ onChange = () => {} }) => {
  const [active, setActive] = useState(false)

  const neg = (val: boolean): boolean => !val
  const handler = () => {
    setActive(neg)
    onChange(active)
  }

  return (
    <span
      onClick={handler}
      className={`${styles.btn} ${active && styles['btn--active']}`}
    />
  )
}

export default ThemeSwitch
