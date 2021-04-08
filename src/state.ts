import { proxy, subscribe } from "valtio"
import vercelAxios from "./vercel/vercelAxios"
import { devtools } from "valtio/utils"

const stateFromStorage: {
  code?: string
  configurationId?: string
  accessToken?: string
  csrfToken?: string
  selectedProjects?: string[]
} =
  typeof window !== `undefined` && localStorage.getItem("state")
    ? JSON.parse(localStorage.getItem("state")!)
    : {}

const state = proxy({
  code: undefined as string | undefined,
  configurationId: undefined as string | undefined,
  next: undefined as string | undefined,
  accessToken: undefined as string | undefined,
  csrfToken: undefined as string | undefined,
  selectedProjects: [] as string[],
  ...stateFromStorage,

  setSelectedProjects: (projects: string[]) =>
    (state.selectedProjects = projects),
})

const checkAndUpdateAccessToken = () => {
  if (state.accessToken) {
    vercelAxios.defaults.headers.authorization = `Bearer ${state.accessToken}`
  } else {
    delete vercelAxios.defaults.headers.authorization
  }
}

subscribe(state, () => {
  localStorage.setItem(
    "state",
    JSON.stringify({
      code: state.code,
      configurationId: state.configurationId,
      accessToken: state.accessToken,
      csrfToken: state.csrfToken,
      selectedProjects: state.selectedProjects,
    })
  )
  checkAndUpdateAccessToken()
})

checkAndUpdateAccessToken()

export default state

devtools(state, "state")