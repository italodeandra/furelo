import { connectDb, cors, runMiddleware } from "next-library"
import config from "../../config"
import { NextApiRequest, NextApiResponse } from "next"
import Integration from "../../models/message"

const integration = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors(), connectDb(config.databaseUrl))

  const { code, configurationId, next } = req.query as {
    code: string
    configurationId: string
    next: string
  }

  if (!code || !configurationId || !next) {
    return res.status(400).send("Bad Request")
  }

  const integrationDoc = new Integration({ code, configurationId })

  await integrationDoc.save()

  res.redirect(next)
}

// noinspection JSUnusedGlobalSymbols
export default integration
