export enum Style {
  Reset = '\x1b[0m',
  Bright = '\x1b[1m',
  Dim = '\x1b[2m',
  Underscore = '\x1b[4m',
  Blink = '\x1b[5m',
  Reverse = '\x1b[7m',
  Hidden = '\x1b[8m',

  FgReset = '\x1b[0m',
  FgBlack = '\x1b[30m',
  FgRed = '\x1b[31m',
  FgGreen = '\x1b[32m',
  FgYellow = '\x1b[33m',
  FgBlue = '\x1b[34m',
  FgMagenta = '\x1b[35m',
  FgCyan = '\x1b[36m',
  FgWhite = '\x1b[37m',
  FgGray = '\x1b[90m',

  BgReset = '\x1b[10m',
  BgBlack = '\x1b[40m',
  BgRed = '\x1b[41m',
  BgGreen = '\x1b[42m',
  BgYellow = '\x1b[43m',
  BgBlue = '\x1b[44m',
  BgMagenta = '\x1b[45m',
  BgCyan = '\x1b[46m',
  BgWhite = '\x1b[47m',
  BgGray = '\x1b[100m',
}

// "⚙", "D" // debug

export interface LoggerOptions {
  level: number
}

export interface LoggerMessage {
  tag?: {
    label: string
    styles?: Style[] | string[]
  }
  level?: number
  message?: string
  styles?: Style[] | string[]
  printer?: Function
  attachments?: any | any[]
}

export class Logger {
  private options: LoggerOptions
  private lastLog: LoggerMessage = {}

  set level(level: number) {
    this.options.level = Math.max(-1, Math.min(level, 5))
  }

  get level() {
    return this.options.level
  }

  get startTag() {
    return this.color('◐', [Style.Bright, Style.FgMagenta])
  }
  get successTag() {
    return this.color('✓', [Style.Bright, Style.FgGreen])
  }
  get infoTag() {
    return this.color('i', [Style.Bright, Style.FgWhite])
  }
  get errorTag() {
    return this.color('✖', [Style.Bright, Style.FgRed])
  }
  get warnTag() {
    return this.color('⚠', [Style.Bright, Style.FgYellow])
  }
  get traceTag() {
    return this.color('→', [Style.Bright, Style.FgCyan])
  }
  get debugTag() {
    return this.color('⚙', [Style.Bright, Style.FgCyan])
  }

  constructor(options?: LoggerOptions) {
    const defaultOptions = {
      level: 3,
    }
    this.options = options || defaultOptions
  }

  private _print(message: LoggerMessage): void {
    if (
      !message.printer ||
      !message.message ||
      (message.level && this.options.level < message.level)
    )
      return

    const styledTag = message.tag
      ? this.color(` ${message.tag.label} `, [...(message.tag.styles ?? []), Style.FgBlack]) + '\t'
      : ''
    const styledAttachments = (
      Array.isArray(message.attachments) ? message.attachments : [message.attachments]
    )
      .map((attachment) => {
        if (attachment instanceof Error) {
          message.message += ' ' + attachment.message
          return attachment.stack
            ?.split('\n')
            .map((trace: string) => this.parseTrace(trace.trim()))
            .filter((trace: string | undefined) => trace)
            .join('\n')
        }
        if (this.isTrace(attachment)) {
          return attachment
            .split('\n')
            .map((trace: string) => this.parseTrace(trace.trim()))
            .filter((trace: string | undefined) => trace)
            .join('\n')
        }
        if (typeof attachment === 'object') {
          return JSON.stringify(attachment, null, 2)
        }
        if (typeof attachment === 'function') {
          return this.parseFunction(attachment.toString())
        }

        return attachment
      })
      .join('\n\n')
    const styledMessage = message.message

    const tagString = (styledTag && !this.lastLog.attachments ? '\n' : '') + styledTag
    const messageString = styledMessage
    const attachmentsString =
      styledAttachments && styledAttachments.length ? '\n\n' + styledAttachments + '\n' : ''

    message.printer(tagString + messageString + attachmentsString)

    this.lastLog = message
  }

  private getTrace(): string | undefined {
    const trace = new Error().stack?.split('\n')

    if (!trace || trace.length < 3) {
      return undefined
    }
    return trace.slice(3).join('\n')
  }

  private isTrace(traceString?: string): boolean | undefined {
    if (!traceString) return undefined
    // Jesus Christ that's Jason Bourne
    const regex = /at\s+([^[\s]+)\s*(?:\[([^\]]+)\])?\s*\(([^)]+)\)/
    return regex.test(traceString)
  }

  private parseTrace(traceString?: string): string | undefined {
    if (!traceString) return undefined

    // Jesus Christ that's Jason Bourne
    const regex = /at\s+([^[\s]+)\s*(?:\[([^\]]+)\])?\s*\(([^)]+)\)/
    const match = traceString?.match(regex)

    const trace: {
      at?: string
      as?: string
      path?: string
    } = (() => {
      if (!match) return {}
      return {
        at: match[1],
        as: match[2],
        path: match[3],
      }
    })()

    if (!trace.at && !trace.as && !trace.path) return undefined

    const array = [this.color('   at', [Style.FgGray])]

    if (trace.at) array.push(this.color(trace.at, [Style.FgWhite]))
    if (trace.as) array.push(this.color(`[${trace.as}]`, [Style.FgWhite]))
    if (trace.path)
      array.push(
        this.color('(', [Style.FgWhite])! +
          this.color(trace.path, [Style.FgCyan])! +
          this.color(')', [Style.FgWhite])!
      )
    return array.join(' ')
  }

  private parseFunction(functionString?: string): string | undefined {
    if (!functionString) return undefined

    let nesting = 0

    return functionString
      .split('\n')
      .map((line) => line.trim())
      .map((line) => {
        if (!line.includes('{')) {
          nesting -= [...line].filter((c) => c === '}').length * 2
        }
        const formattedLine = ' '.repeat(nesting) + line
        if (!line.includes('}')) {
          nesting += [...line].filter((c) => c === '{').length * 2
        }
        return formattedLine
      })
      .join('\n')
  }

  color(data: any, styles?: Style[] | string[]): string | undefined {
    if (!data) return

    return styles?.join('') + data.toString() + Style.Reset
  }

  error(message?: any, ...attachments: any[]): void {
    if (!message) return

    this._print({
      message: message.toString(),
      printer: console.error,
      tag: { label: 'ERROR', styles: [Style.BgRed] },
      level: 1,
      attachments: attachments,
    })
  }

  warn(message?: any, ...attachments: any[]): void {
    if (!message) return

    this._print({
      message: message.toString(),
      printer: console.warn,
      tag: { label: 'WARN', styles: [Style.BgYellow] },
      level: 2,
      attachments: attachments,
    })
  }

  log(message?: any, ...attachments: any[]): void {
    if (!message) return

    this._print({
      message: message.toString(),
      printer: console.log,
      level: 3,
      attachments: attachments,
    })
  }

  info(message?: any, ...attachments: any[]): void {
    if (!message) return

    this._print({
      message: message.toString(),
      printer: console.info,
      level: 4,
      attachments: attachments,
    })
  }

  debug(message?: any, ...attachments: any[]): void {
    if (!message) return

    this._print({
      message: message.toString(),
      printer: console.debug,
      tag: { label: 'DEBUG', styles: [Style.BgCyan] },
      level: 5,
      attachments: attachments,
    })
  }

  trace(message?: any, ...attachments: any[]): void {
    if (!message) return

    const trace = this.getTrace()

    this._print({
      message: message.toString(),
      printer: console.log,
      tag: { label: 'TRACE', styles: [Style.BgCyan] },
      level: 5,
      attachments: trace && trace.length ? [trace, ...attachments] : attachments,
    })
  }
}
