import Head from "next/head"
import { ThemeProvider } from "@material-ui/core/styles"
import { CacheProvider } from "@emotion/react"
import CssBaseline from "@material-ui/core/CssBaseline"
import createCache from "@emotion/cache"
import theme from "../theme"
import { useEffect, VFC } from "react"
import { Box } from "@material-ui/core"
import { NProgress, Snackbar } from "react-library"

export const cache = createCache({ key: "css", prepend: true })

const MyApp: VFC<any> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <CacheProvider value={cache}>
      <Head>
        <title>Furelo</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href={"/favicon.ico"} />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Snackbar />
        <NProgress />
        <Box sx={{ display: "flex" }}>
          <Component {...pageProps} />
        </Box>
      </ThemeProvider>
    </CacheProvider>
  )
}

// noinspection JSUnusedGlobalSymbols
export default MyApp
