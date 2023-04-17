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
    console.log(
      consoleColor.FgGray +
        `${getTimestamp()} - ${message}` +
        consoleColor.FgWhite
    )
  },
  warn(message: any) {
    console.warn(
      consoleColor.FgYellow +
        `${getTimestamp()} - ${message}` +
        consoleColor.FgWhite
    )
  },
  error(message: any) {
    console.error(
      consoleColor.FgRed +
        `${getTimestamp()} - ${message}` +
        consoleColor.FgWhite
    )
  },
  info(message: any) {
    console.info(
      consoleColor.FgWhite +
        `${getTimestamp()} - ${message}` +
        consoleColor.FgWhite
    )
  },
  debug(message: any) {
    console.debug(
      consoleColor.FgCyan +
        `${getTimestamp()} - ${message}` +
        consoleColor.FgWhite
    )
  },
}

export default logger
