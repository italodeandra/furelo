export default interface User {
  uid: string
  email: string
  name: string
  username: string
  avatar: string
  platformVersion: string
  billing: Billing
  bio: string
  website: string
  profiles: Profile[]
}

export interface Billing {
  plan: string
  period: any
  trial: any
  cancelation: any
  addons: any
}

export interface Profile {
  service: string
  link: string
}