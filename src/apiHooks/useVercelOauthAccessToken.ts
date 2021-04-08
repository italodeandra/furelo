import { useMutation } from "react-query"
import axios, { AxiosError } from "axios"
import {
  VercelOauthAccessTokenReqBody,
  VercelOauthAccessTokenResponse,
} from "../pages/api/vercelOauthAccessToken"
import { UseMutationOptions } from "react-query/types/react/types"

const useVercelOauthAccessToken = <
  TData = VercelOauthAccessTokenReqBody["code"],
  TError = AxiosError,
  TVariables = VercelOauthAccessTokenReqBody,
  TContext = unknown
>(
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
) =>
  useMutation(
    (data) =>
      axios
        .post<VercelOauthAccessTokenResponse>(
          "/api/vercelOauthAccessToken",
          data
        )
        .then((res) => res.data.accessToken),
    options
  )

export default useVercelOauthAccessToken
