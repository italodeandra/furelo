import { useRouter } from "next/router"
import { useLogger } from "react-use"
import { useEffect, useState } from "react"
import state from "../state"
import { CircularProgress, Typography } from "@material-ui/core"
import { FullBoxCenter } from "../components"

const Integration = () => {
  const route = useRouter()
  const query = route.query as {
    code?: string
    configurationId?: string
    next?: string
  }
  const [isTimedOut, setTimedOut] = useState(false)
  useLogger("Integration", "query", query)

  useEffect(() => {
    if (query.code && query.next && query.configurationId) {
      state.code = query.code
      state.configurationId = query.configurationId
      void route.push(query.next)
    }

    const timer = setTimeout(() => {
      setTimedOut(true)
    }, 30000)
    return () => clearTimeout(timer)
  }, [query.code, query.next, query.configurationId])

  return (
    <FullBoxCenter>
      {!isTimedOut ? (
        <>
          <Typography>Setting up...</Typography>
          <CircularProgress color="inherit" sx={{ mt: 2 }} />
        </>
      ) : (
        <>
          <Typography>Something went wrong and the setup timed out.</Typography>
          <Typography>Try again later.</Typography>
        </>
      )}
    </FullBoxCenter>
  )
}

// noinspection JSUnusedGlobalSymbols
export default Integration
