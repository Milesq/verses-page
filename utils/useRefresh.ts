import { useState } from 'react'

function useRefresh(): () => void {
  const [x, refresh] = useState(1)

  return () => refresh(x * -1)
}

export default useRefresh
