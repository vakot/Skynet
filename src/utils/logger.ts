export enum FgColor {
  Empty = '\x1b[0m',
  Black = '\x1b[30m',
  Red = '\x1b[31m',
  Green = '\x1b[32m',
  Yellow = '\x1b[33m',
  Blue = '\x1b[34m',
  Magenta = '\x1b[35m',
  Cyan = '\x1b[36m',
  White = '\x1b[37m',
  Gray = '\x1b[90m',
}
export enum BgColor {
  Empty = '\x1b[10m',
  Black = '\x1b[40m',
  Red = '\x1b[41m',
  Green = '\x1b[42m',
  Yellow = '\x1b[43m',
  Blue = '\x1b[44m',
  Magenta = '\x1b[45m',
  Cyan = '\x1b[46m',
  White = '\x1b[47m',
  Gray = '\x1b[100m',
}
export enum Color {
  Empty = 'Empty',
  Black = 'Black',
  Red = 'Red',
  Green = 'Green',
  Yellow = 'Yellow',
  Blue = 'Blue',
  Magenta = 'Magenta',
  Cyan = 'Cyan',
  White = 'White',
  Gray = 'Gray',
}

// TODO: colors
// empty: init(0, 0),
// bold: init(1, 22, "\u001B[22m\u001B[1m"),
// dim: init(2, 22, "\u001B[22m\u001B[2m"),
// italic: init(3, 23),
// underline: init(4, 24),
// inverse: init(7, 27),
// hidden: init(8, 28),
// strikethrough: init(9, 29),
// black: init(30, 39),
// red: init(31, 39),
// green: init(32, 39),
// yellow: init(33, 39),
// blue: init(34, 39),
// magenta: init(35, 39),
// cyan: init(36, 39),
// white: init(37, 39),
// gray: init(90, 39),
// bgBlack: init(40, 49),
// bgRed: init(41, 49),
// bgGreen: init(42, 49),
// bgYellow: init(43, 49),
// bgBlue: init(44, 49),
// bgMagenta: init(45, 49),
// bgCyan: init(46, 49),
// bgWhite: init(47, 49),
// blackBright: init(90, 39),
// redBright: init(91, 39),
// greenBright: init(92, 39),
// yellowBright: init(93, 39),
// blueBright: init(94, 39),
// magentaBright: init(95, 39),
// cyanBright: init(96, 39),
// whiteBright: init(97, 39),
// bgBlackBright: init(100, 49),
// bgRedBright: init(101, 49),
// bgGreenBright: init(102, 49),
// bgYellowBright: init(103, 49),
// bgBlueBright: init(104, 49),
// bgMagentaBright: init(105, 49),
// bgCyanBright: init(106, 49),
// bgWhiteBright: init(107, 49),

// TODO: status with unicode detection
// error: s("✖", "×"),
// warn: s("⚠", "‼"),
// info: s("ℹ", "i"),
// success: s("✔", "√"),
// debug: s("⚙", "D"),
// trace: s("→", "→"),
// fail: s("✖", "×"),
// start: s("◐", "o"),

export interface LoggerOptions {
  level: number
}

export interface LoggerMessage {
  tag?: {
    label: string
    color: Color | BgColor
  }
  level?: number
  message?: string
  printer?: Function
  attachments?: any | any[]
}

export interface LoggerColor {
  background?: Color | BgColor
  foreground?: Color | FgColor
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
      ? this.color(` ${message.tag.label} `, {
          background: message.tag.color,
          foreground: Color.Black,
        }) + '\t'
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

    const array = [this.color('   at', { foreground: Color.Gray })]

    if (trace.at) array.push(this.color(trace.at, { foreground: Color.White }))
    if (trace.as) array.push(this.color(`[${trace.as}]`, { foreground: Color.White }))
    if (trace.path)
      array.push(
        this.color('(', { foreground: Color.White })! +
          this.color(trace.path, { foreground: Color.Cyan })! +
          this.color(')', { foreground: Color.White })!
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

  color(data: any, color?: LoggerColor): string | undefined {
    if (!data) return

    const foreground = color?.foreground
      ? color.foreground in Color
        ? FgColor[color.foreground as Color]
        : color.foreground
      : FgColor.Empty
    const background = color?.background
      ? color.background in Color
        ? BgColor[color.background as Color]
        : color.background
      : BgColor.Empty

    return foreground + background + data.toString() + FgColor.Empty + BgColor.Empty
  }

  error(message?: any, ...attachments: any[]): void {
    if (!message) return

    console.log(this, message)

    this._print({
      message: message.toString(),
      printer: console.error,
      tag: { label: 'ERROR', color: Color.Red },
      level: 1,
      attachments: attachments,
    })
  }

  warn(message?: any, ...attachments: any[]): void {
    if (!message) return

    this._print({
      message: message.toString(),
      printer: console.warn,
      tag: { label: 'WARN', color: Color.Yellow },
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
      tag: { label: 'DEBUG', color: Color.Cyan },
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
      tag: { label: 'TRACE', color: Color.Cyan },
      level: 5,
      attachments: trace && trace.length ? [trace, ...attachments] : attachments,
    })
  }
}
