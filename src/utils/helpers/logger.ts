import moment from 'moment'

function getTimestamp(): string {
  return moment(Date.now()).format('HH:mm:ss')
}

export const consoleColor = {
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

const logger = {
  log(message: any) {
    message = `${getTimestamp()} - ${message}`

    console.log(consoleColor.FgGray + message + consoleColor.FgWhite)

    save(message, 'gray')
  },
  warn(message: any) {
    message = `${getTimestamp()} - ${message}`

    console.warn(consoleColor.FgYellow + message + consoleColor.FgWhite)

    save(message, 'yellow')
  },
  error(message: any) {
    message = `${getTimestamp()} - ${message}`

    console.error(consoleColor.FgRed + message + consoleColor.FgWhite)

    save(message, 'red')
  },
  info(message: any) {
    message = `${getTimestamp()} - ${message}`

    console.info(consoleColor.FgWhite + message + consoleColor.FgWhite)

    save(message, 'white')
  },
  debug(message: any) {
    message = `${getTimestamp()} - ${message}`

    console.debug(consoleColor.FgCyan + message + consoleColor.FgWhite)

    save(message, 'cyan')
  },
}

function save(
  message: string,
  color: 'cyan' | 'yellow' | 'red' | 'gray' | 'white'
) {
  const colored = () => {
    if (color === 'cyan') {
      return `\`\`\`ansi\n[0;2m[0;31m[0;34m${message}[0m[0;31m[0m[0m\`\`\``
    }
    if (color === 'yellow') {
      return `\`\`\`ansi\n[0;2m[0;31m[0;34m[0;30m[0;33m${message}[0m[0;30m[0m[0;34m[0m[0;31m[0m[0m\`\`\``
    }
    if (color === 'red') {
      return `\`\`\`ansi\n[0;2m[0;31m[0;34m${message}[0m[0;31m[0m[0m\`\`\``
    }
    if (color === 'gray') {
      return `\`\`\`ansi\n[0;2m[0;31m[0;34m[0;30m${message}[0m[0;34m[0m[0;31m[0m[0m\`\`\``
    }
    if (color === 'white') {
      return `\`\`\`${message}\`\`\``
    }
  }
}

export default logger
