import { StylesConfig } from 'react-select'

const themedStyle: StylesConfig<Record<string, string>, false> = {
  control: styles => ({
    ...styles,
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--input-border-color)',
  }),
  singleValue: styles => ({
    ...styles,
    color: 'var(--input-text)',
  }),
  placeholder: styles => ({
    ...styles,
    color: '#9CA3AF',
  }),
  option: styles => ({
    ...styles,
    color: 'var(--input-text)',
    backgroundColor: 'var(--input-bg)',
    cursor: 'pointer',
    ':hover': {
      ...styles[':hover'],
      backgroundColor: 'var(--input-bg-hover)',
    },
    ':focus': {
      ...styles[':focus'],
      backgroundColor: 'var(--input-bg-focus)',
    },
  }),
  menuList: styles => ({
    ...styles,
    backgroundColor: 'var(--input-bg)',
  }),
  input: styles => ({
    ...styles,
    color: 'var(--input-text)',
  }),
}

export default themedStyle
