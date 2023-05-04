import moment from 'moment'

function getTimestamp(): string {
  return moment(Date.now()).format('HH:mm:ss')
}

export const Color = {
  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
  FgGray: '\x1b[90m',
}

class Logger {
  // readonly story: string[] = []

  log(message: any) {
    const time = Color.FgWhite + '[' + getTimestamp() + '] '
    const data = Color.FgGray + message
    console.warn(time + data + Color.FgWhite)
  }
  warn(message: any) {
    const time = Color.FgWhite + '[' + getTimestamp() + '] '
    const data = Color.FgYellow + message
    console.warn(time + data + Color.FgWhite)
  }
  error(message: any) {
    const time = Color.FgWhite + '[' + getTimestamp() + '] '
    const data = Color.FgRed + message
    console.error(time + data + Color.FgWhite)
  }
  info(message: any) {
    const time = Color.FgWhite + '[' + getTimestamp() + '] '
    const data = Color.FgWhite + message
    console.info(time + data + Color.FgWhite)
  }
  debug(message: any) {
    const time = Color.FgWhite + '[' + getTimestamp() + '] '
    const data = Color.FgMagenta + message
    console.debug(time + data + Color.FgWhite)
  }

  status = {
    ok(message: any) {
      this._print(message, 'OK', Color.FgGreen)
    },
    failed(message: any, error?: any) {
      this._print(message, 'FAILED', Color.FgRed)
      if (error) {
        const leadingSpaces = (message.match(/^\s+/) || [''])[0].length
        console.log(' '.repeat(leadingSpaces) + Color.FgRed + error + Color.FgWhite)
      }
    },
    warn(message: any, warn?: any) {
      this._print(message, 'WARN', Color.FgYellow)
      if (warn) {
        const leadingSpaces = (message.match(/^\s+/) || [''])[0].length
        console.log(' '.repeat(leadingSpaces) + Color.FgRed + warn + Color.FgWhite)
      }
    },
    _print(message: any, status: string, color: string) {
      console.log(
        `${Color.FgGray}[${color}${status.padStart(4 + status.length / 2).padEnd(8)}${
          Color.FgGray
        }] - ${message}${Color.FgWhite}`
      )
    },
  }
  colored = {
    black(message: any) {
      console.log(Color.FgBlack + message + Color.FgWhite)
    },
    red(message: any) {
      console.log(Color.FgRed + message + Color.FgWhite)
    },
    green(message: any) {
      console.log(Color.FgGreen + message + Color.FgWhite)
    },
    yellow(message: any) {
      console.log(Color.FgYellow + message + Color.FgWhite)
    },
    blue(message: any) {
      console.log(Color.FgBlue + message + Color.FgWhite)
    },
    magenta(message: any) {
      console.log(Color.FgMagenta + message + Color.FgWhite)
    },
    cyan(message: any) {
      console.log(Color.FgCyan + message + Color.FgWhite)
    },
    white(message: any) {
      console.log(Color.FgWhite + message + Color.FgWhite)
    },
    gray(message: any) {
      console.log(Color.FgGray + message + Color.FgWhite)
    },
  }
}

export const LoggerType = typeof Logger

export default new Logger()

// if (color === 'cyan') {
//   return `\`\`\`ansi\n[0;2m[0;31m[0;34m${message}[0m[0;31m[0m[0m\`\`\``
// }
// if (color === 'yellow') {
//   return `\`\`\`ansi\n[0;2m[0;31m[0;34m[0;30m[0;33m${message}[0m[0;30m[0m[0;34m[0m[0;31m[0m[0m\`\`\``
// }
// if (color === 'red') {
//   return `\`\`\`ansi\n[0;2m[0;31m[0;34m${message}[0m[0;31m[0m[0m\`\`\``
// }
// if (color === 'gray') {
//   return `\`\`\`ansi\n[0;2m[0;31m[0;34m[0;30m${message}[0m[0;34m[0m[0;31m[0m[0m\`\`\``
// }
// if (color === 'white') {
//   return `\`\`\`${message}\`\`\``
// }
