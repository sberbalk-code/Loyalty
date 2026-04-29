import { useEffect, useRef } from 'react'

/**
 * Provides a safe `readFileAsDataURL(file)` that won't fire its callback
 * if the component unmounts before the read finishes. Prevents
 * "setState on unmounted component" warnings in React strict mode.
 */
export function useSafeFileReader() {
  const aliveRef = useRef(true)

  useEffect(() => {
    aliveRef.current = true
    return () => {
      aliveRef.current = false
    }
  }, [])

  function readFileAsDataURL(file, onSuccess, onError) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (aliveRef.current) onSuccess(ev.target.result)
    }
    reader.onerror = () => {
      if (aliveRef.current && onError) onError(reader.error)
    }
    reader.readAsDataURL(file)
  }

  return { readFileAsDataURL }
}
