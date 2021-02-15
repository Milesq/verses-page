import { useState, useEffect } from 'react'
import throttle from 'lodash.throttle'

interface ScrollData {
  x: number
  y: number
}

function useScroll(): ScrollData {
  const [scrollData, setScroll] = useState({
    x: 0,
    y: 0,
  })

  const scrollHandler = throttle(
    () =>
      setScroll({
        x: window.scrollX,
        y: window.scrollY,
      }),
    50
  )

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler)

    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  })

  return scrollData
}

export default useScroll
