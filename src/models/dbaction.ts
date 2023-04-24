export class DataBaseAction {
  data: { name: string }

  event: DataBaseActionEvents

  once: boolean

  async execute(...args: any): Promise<any> {}

  constructor(options: {
    data: { name: string }
    event: DataBaseActionEvents
    once?: boolean
    execute(...args: any): Promise<any>
  }) {
    this.data = options.data
    this.event = options.event
    this.once = options.once ?? false
    this.execute = options.execute
  }
}

export enum DataBaseActionEvents {
  Error = 'error',
  Connected = 'connected',
  Connecting = 'connecting',
  Disconnected = 'disconnected',
}
