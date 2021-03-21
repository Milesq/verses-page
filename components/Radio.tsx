import { useState } from 'react'
import { useChanged } from '../hooks'
import { LabeledValue } from '../utils'

interface RadioProps {
  label: string
  values: LabeledValue[]
  defaultValue: string
  onChange: (value: string) => void
}

function Radio({ label, values, onChange, defaultValue }: Partial<RadioProps>) {
  const [choosenOne, designateChoosenOne] = useState(defaultValue)

  useChanged(() => {
    onChange?.(choosenOne)
  }, [choosenOne])

  return (
    <div>
      <span>{label}:&nbsp;</span>

      {values.map(({ label: sign, value }) => (
        <button
          onClick={() => designateChoosenOne(value)}
          type="button"
          className={`
            bg-transparent
            ${choosenOne === value && 'bg-gray-600 text-white'}
            hover:bg-gray-600
            text-blue-dark
            font-semibold
            text-sm
            hover:text-white
            py-1 px-2
            mx-1
            border
            border-blue
            hover:border-transparent
            rounded
          `}
        >
          {sign}
        </button>
      ))}
    </div>
  )
}

export default Radio
