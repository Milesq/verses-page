import { useState } from 'react'
import type { FC } from 'react'
import { inc } from 'ramda'

const Home: FC = () => {
  const [count, setCount] = useState(0)
  const x = {
    s: 3,
  }
  console.log(x)

  return (
    <div className="bg-gray-500 text-white w-11" onClick={() => setCount(inc)}>
      {count}
    </div>
  )
}

export default Home
