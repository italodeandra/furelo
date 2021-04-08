import { useState } from "react"
import { useDeepCompareEffect, useLogger } from "react-use"

interface StreamState {
  data: Uint8Array | null
  error: Error | null
  controller: AbortController
}

const useStream = (
  url?: string,
  options?: RequestInit
): {
  data: Uint8Array | null
  error: Error | null
  abort: () => void
} => {
  const [state, setState] = useState<StreamState>({
    data: null,
    error: null,
    controller: new AbortController(),
  })

  useLogger("useStream", { url })

  useDeepCompareEffect(() => {
    if (url) {
      ;(async () => {
        try {
          const resp = await fetch(url, {
            ...options,
            signal: state.controller.signal,
          })
          if (!resp.ok || !resp.body) {
            // noinspection ExceptionCaughtLocallyJS
            throw resp.statusText
          }

          const reader = resp.body.getReader()
          while (true) {
            const { value, done } = await reader.read()
            if (done) {
              break
            }

            setState((prevState) => ({ ...prevState, ...{ data: value } }))
          }
        } catch (err) {
          console.error(err)
          if (err.name !== "AbortError") {
            setState((prevState) => ({ ...prevState, ...{ error: err } }))
          }
        }
      })()

      return () => state.controller.abort()
    }
  }, [url, options])

  return {
    data: state.data,
    error: state.error,
    abort: () => state.controller && state.controller.abort(),
  }
}

export default useStream
