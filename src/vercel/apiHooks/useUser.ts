import { useQuery } from "react-query"
import vercelAxios from "../vercelAxios"
import User from "../models/user"
import { UseQueryOptions } from "react-query/types/react/types"

const useUser = (options?: UseQueryOptions<unknown, unknown, User>) =>
  useQuery(
    "user",
    () =>
      vercelAxios.get<{ user: User }>("/www/user").then((res) => res.data.user),
    { suspense: true, ...options }
  )

export default useUser
