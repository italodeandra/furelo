import { NextApiRequest, NextApiResponse } from "next"
import {
  badRequest,
  cors,
  internalServerError,
  runMiddleware,
} from "next-library"
import vercelAxios from "../../vercel/vercelAxios"
import config from "../../config"
import { AxiosError } from "axios"

export type VercelOauthAccessTokenReqBody = {
  code: string
}

export type VercelOauthAccessTokenResponse = {
  accessToken: string
}

const vercelOauthAccessToken = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await runMiddleware(req, res, cors())

  const { code } = req.body as Partial<VercelOauthAccessTokenReqBody>

  if (!code) {
    return badRequest(res)
  }

  let accessToken = ""
  try {
    const params = new URLSearchParams()
    params.append("client_id", config.clientId)
    params.append("client_secret", config.clientSecret)
    params.append("code", code)
    params.append("redirect_uri", `${config.baseUrl}/integration`)
    accessToken = await vercelAxios
      .post("/v2/oauth/access_token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => res.data.access_token)
  } catch (e) {
    const err: AxiosError = e
    console.error(err.isAxiosError ? err.response.data : err)
    if (err.isAxiosError && err.response.status === 400) {
      if (err.response.data.error === "invalid_grant") {
        return res.status(400).send("invalid_grant")
      }
      return badRequest(res)
    }
    return internalServerError(res)
  }

  res.send({
    accessToken,
  } as VercelOauthAccessTokenResponse)
}

// noinspection JSUnusedGlobalSymbols
export default vercelOauthAccessToken
