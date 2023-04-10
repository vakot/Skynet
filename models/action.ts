export interface IAction {
  name: string
  execute(...args: any): any
}
