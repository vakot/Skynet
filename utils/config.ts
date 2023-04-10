import { config as getConfig } from 'dotenv'

getConfig()

const config = {
  TOKEN: process.env.TOKEN || '',
  PREFIX: process.env.PREFIX || '!',
  LOCALE: process.env.LOCALE || 'en',
  CLIENT_ID: process.env.CLIENT_ID || '',
  GUILD_ID: process.env.GUILD_ID || '',
}

export { config }
