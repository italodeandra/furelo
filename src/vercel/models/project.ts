import Deployment from "./deployment"

export default interface Project {
  id: string
  name: string
  targets: {
    production?: Deployment
  }
}