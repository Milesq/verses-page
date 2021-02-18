import { useRef, useEffect, EffectCallback, DependencyList } from 'react'

function useChanged(effect: EffectCallback, deps?: DependencyList): void {
  const ref = useRef(false)

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (ref.current) {
      return effect()
    }

    ref.current = true
  }, deps)
}

export default useChanged
