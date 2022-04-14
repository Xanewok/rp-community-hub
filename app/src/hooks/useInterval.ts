import React, { useEffect, useRef } from 'react'

export function useInterval(
  callback: React.EffectCallback,
  delay: number | null
): React.MutableRefObject<number | null> {
  const intervalRef = useRef<number | null>(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (typeof delay === 'number') {
      intervalRef.current = window.setInterval(
        () => callbackRef.current(),
        delay
      )

      return () => window.clearInterval(intervalRef.current || 0)
    }
  }, [delay])

  return intervalRef
}
