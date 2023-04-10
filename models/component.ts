export interface IComponent {
  data: { name: string }
  execute(...args: any): any
  cooldown?: number
}
