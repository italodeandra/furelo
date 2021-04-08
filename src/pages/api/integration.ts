import { badRequest, conflict, connectDb, cors, runMiddleware } from "next-library"
import config from "../../config"
import { NextApiRequest, NextApiResponse } from "next"
import Integration from "../../models/integration"
import nookies from 'nookies'

const integration = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors(), connectDb(config.databaseUrl))

  const { code, configurationId, next } = req.query as {
    code: string
    configurationId: string
    next: string
  }

  if (!code || !configurationId || !next) {
    return badRequest(res)
  }

  if (await Integration.countDocuments({ code, configurationId }) > 0) {
    return conflict(res)
  }

  const integrationDoc = new Integration({ code, configurationId })

  nookies.set

  await integrationDoc.save()

  res.redirect(next)
}

// noinspection JSUnusedGlobalSymbols
export default integration
