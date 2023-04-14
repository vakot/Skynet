import moment from 'moment'

function getTimestamp(): string {
  return moment(Date.now()).format('HH:mm:ss')
}

export const logger = {
  log(message: any) {
    console.log(`${getTimestamp()} - ${message}`)
  },
  warn(message: any) {
    console.warn(`${getTimestamp()} - !WARNING! ${message}`)
  },
  error(message: any) {
    console.error(`${getTimestamp()} - !ERROR! ${message}`)
  },
  info(message: any) {
    console.info(`${getTimestamp()} - !INFO! ${message}`)
  },
  debug(message: any) {
    console.debug(`${getTimestamp()} - !DEBUG! ${message}`)
  },
}
