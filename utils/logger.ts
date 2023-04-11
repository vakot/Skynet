import moment from 'moment'

function getTimestamp(): string {
  return moment(Date.now()).format('HH:mm:ss')
}

export const logger = {
  log(message: string) {
    console.log(`${getTimestamp()} - ${message}`)
  },
  warn(message: string) {
    console.warn(`${getTimestamp()} - !WARNING! ${message}`)
  },
  error(message: string) {
    console.error(`${getTimestamp()} - !ERROR! ${message}`)
  },
  info(message: string) {
    console.info(`${getTimestamp()} - ${message}`)
  },
  debug(message: string) {
    console.debug(`${getTimestamp()} - ${message}`)
  },
}
