export class Category {
  name: string
  description?: string
  emoji?: string

  getName(): string {
    const name = []
    if (this.emoji) name.push(this.emoji)
    name.push(this.name)
    return name.join('・')
  }

  constructor(options: { name: string; description?: string; emoji?: string }) {
    this.name = options.name
    this.description = options.description
    this.emoji = options.emoji
  }
}
