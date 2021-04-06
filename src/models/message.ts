import mongoose, { Document } from "mongoose"

export interface IIntegration extends Document {
  code: string
  configurationId: string
}

export interface IIntegrationReqBody {
  code: string
  configurationId: string
}

const integrationSchema = new mongoose.Schema<IIntegration>({
  code: String,
  configurationId: String,
})

const Integration =
  mongoose.models.Integration ||
  mongoose.model("Integration", integrationSchema)

export default Integration
