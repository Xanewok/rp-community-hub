import { useState } from 'react'

const debouncers = {} as Record<string, { timer: any; prev: Date }>

function debounce(key: string, delayMs: number, cb: Function) {
  const now = new Date()
  const { timer, prev } = debouncers[key] || {}
  if (!!prev && now.getTime() - prev.getTime() < delayMs) {
    clearTimeout(timer)
  }

  const newTimer = setTimeout(cb, delayMs)
  debouncers[key] = { timer: newTimer, prev: now }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error also return initialValue
      console.log(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      if (typeof window !== 'undefined') {
        debounce(key, 1000, () => {
          console.log('Debouncing now: ', new Date().getTime())
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        })
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error)
    }
  }

  return [storedValue, setValue] as const
}
