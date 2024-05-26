export function interpolate(template: string = '', context: Record<string, any> = {}): string {
  return template.replace(/\$\{([^}]+)\}/g, (_, match: string) => {
    const keys = match.split('.').map((key) => key.trim())
    let value = context
    for (const key of keys) {
      if (value[key] !== undefined) {
        value = value[key]
      } else {
        return ''
      }
    }
    return value.toString()
  })
}
