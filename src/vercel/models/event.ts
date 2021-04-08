export default interface Event {
  type: "request" | "response" | "command" | "stdout"
  created: number
  payload?: {
    id: string
    date: number
    deploymentId: string
    info: {
      type: string
      name: string
      entrypoint: string
    }
    text: string
  }
}