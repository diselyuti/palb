import type { RouteParamValue } from 'vue-router'

export default interface IPage {
  name: string
  to: {
    name: string
    params?: {
      [key: string]: string | RouteParamValue[]
    }
  }
}
