export type Schema<T> = {
  [K in keyof T]: {
    type: string | [string] | ((value: string) => boolean)
    required: boolean
  }
}
