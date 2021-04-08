import { useEffect } from "react"
import {
  CircularProgress,
  Container,
  NoSsr,
  Typography,
} from "@material-ui/core"
import { useVercelOauthAccessToken } from "../apiHooks"
import state from "../state"
import { useSnapshot } from "valtio"
import { useRouter } from "next/router"
import config from "../config"
import { v4 as uuid } from "uuid"
import { Filters, FullBoxCenter, Header } from "../components"
import Events from "../components/Events/Events"

const Home = () => {
  const router = useRouter()
  const snap = useSnapshot(state)
  let {
    mutate: getAccessToken,
    isError,
    isLoading,
    data: accessToken,
  } = useVercelOauthAccessToken({
    onError(err) {
      console.log("err", err.response.data)
      if (err.isAxiosError && err.response.data === "invalid_grant") {
        state.csrfToken = uuid()
        void router.push(
          `${config.vercelAuthorizeUrl}?client_id=${
            config.clientId
          }&state=${uuid()}`
        )
      }
    },
  })

  useEffect(() => {
    if (!snap.accessToken) {
      if (accessToken) {
        state.accessToken = accessToken
      } else {
        getAccessToken({ code: snap.code })
      }
    }
  }, [accessToken])

  return (
    <NoSsr>
      {!isError ? (
        <>
          {!isLoading && snap.accessToken ? (
            <>
              <Header />
                <Container maxWidth={false}>
                <Filters />
                  <Events />
              </Container>
            </>
          ) : (
            <FullBoxCenter>
              <Typography>Waiting for authentication...</Typography>
              <CircularProgress color="inherit" sx={{ mt: 2 }} />
            </FullBoxCenter>
          )}
        </>
      ) : (
        <FullBoxCenter>
          There was an unexpected error while trying to authenticate
        </FullBoxCenter>
      )}
    </NoSsr>
  )
}

// noinspection JSUnusedGlobalSymbols
export default Home
