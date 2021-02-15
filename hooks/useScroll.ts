import { useState, useEffect } from 'react'

interface ScrollData {
  x: number
  y: number
}

function useScroll(): ScrollData {
  const [scrollData, setScroll] = useState({
    x: 0,
    y: 0,
  })

  const scrollHandler = () =>
    setScroll({
      x: window.scrollX,
      y: window.scrollY,
    })

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler)

    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  })

  return scrollData
}

export default useScroll
