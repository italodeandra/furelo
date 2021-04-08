import Link from "next/link"
import {
  AppBar,
  Box,
  Container,
  Hidden,
  NoSsr,
  Skeleton,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core"
import { SxProps } from "@material-ui/system"
import { useWindowScroll } from "react-use"
import { Suspense } from "react"
import { InlineIcon } from "@iconify/react"
import ErrorBoundary from "../../utils/ErrorBoundary"
import exclamationIcon from "@iconify/icons-heroicons-outline/exclamation"
import useUser from "../../vercel/apiHooks/useUser"
import { grey } from "@material-ui/core/colors"

const toolbarSize: SxProps<Theme> = {
  "&:not(.nothing)": {
    // this selector increases the specificity
    minHeight: (theme) => theme.spacing(11),
  },
}

export const toolbarPlaceholder = <Toolbar sx={toolbarSize} />

const UserName = () => {
  const { data: user } = useUser()

  return <>{user.name}</>
}

const HeaderSSR = () => {
  const { y: scrollTop } = useWindowScroll()
  const theme = useTheme()

  return (
    <>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={
          scrollTop > 8 * 4 ? 3 : scrollTop > 8 * 2 ? 2 : scrollTop > 0 ? 1 : 0
        }
        sx={{
          bgcolor: "rgba(255,255,255,0.5)",
          backdropFilter: "saturate(180%) blur(5px)",
        }}
      >
        <Toolbar
          sx={{
            "&:not(.nothing)": {
              // this selector increases the specificity
              minHeight: scrollTop < 8 * 3 ? 8 * 11 - scrollTop : 8 * 8,
            },
          }}
          disableGutters
        >
          <Container maxWidth={false} sx={{ display: "flex" }}>
            <Link href="/" passHref>
              <Box
                component="a"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "text.primary",
                  textDecoration: "none",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: theme.typography.pxToRem(20),
                    fontWeight: 500,
                  }}
                >
                  <Hidden smDown>
                    Fu<span style={{ color: grey[500] }}>nctions</span> Re
                    <span style={{ color: grey[500] }}>altime</span> Lo
                    <span style={{ color: grey[500] }}>gs</span>
                  </Hidden>
                  <Hidden smUp>Furelo</Hidden>
                </Box>
              </Box>
            </Link>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyItems: "center",
                ml: "auto",
              }}
            >
              <Typography>
                Hello,{" "}
                <ErrorBoundary
                  fallback={
                    <Tooltip title="There was an unexpected error while trying to get the user data">
                      <span>
                        <InlineIcon icon={exclamationIcon} />
                      </span>
                    </Tooltip>
                  }
                >
                  <Suspense
                    fallback={
                      <Skeleton
                        variant="text"
                        width={8 * 10}
                        sx={{ display: "inline-block" }}
                      />
                    }
                  >
                    <UserName />
                  </Suspense>
                </ErrorBoundary>
              </Typography>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
      {toolbarPlaceholder}
    </>
  )
}

const Header = () => (
  <NoSsr>
    <HeaderSSR />
  </NoSsr>
)

export default Header
