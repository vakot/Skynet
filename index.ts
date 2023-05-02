import 'module-alias/register'
import 'dotenv/config'

import { GatewayIntentBits } from 'discord.js'
import mongoose from 'mongoose'
import os from 'os'

import { SkynetClient } from '@modules/models/client'

import { loadActions } from '@utils/setup/loadActions'
import { loadPlugins } from '@utils/setup/loadPlugins'
import { pushCommands } from '@utils/setup/pushCommands'
import { loadEvents } from '@utils/setup/loadEvents'

import logger, { consoleColor } from '@utils/helpers/logger'

export const client = new SkynetClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.loadingStartAt = new Date()

async function Print() {
  console.clear()

  const strUserTag = [
    consoleColor.FgRed,
    os.userInfo().username,
    consoleColor.FgWhite,
    '@',
    consoleColor.FgRed,
    os.hostname(),
    consoleColor.FgWhite,
  ].join('')

  const strSeparator = [consoleColor.FgWhite, '-'.repeat(20)].join('')

  const strClientName = [
    consoleColor.FgRed,
    'Client',
    consoleColor.FgWhite,
    ': ',
    client.user?.tag ?? 'Loading...',
  ].join('')

  const strWS = [
    consoleColor.FgRed,
    'WS',
    consoleColor.FgWhite,
    ': ',
    client.ws.gateway ?? 'Loading...',
  ].join('')

  const strKernel = [
    consoleColor.FgRed,
    'Kernel',
    consoleColor.FgWhite,
    ': ',
    client.isReady() ? '4.92.384.42' : 'Loading...',
  ].join('')

  const strUptime = [
    consoleColor.FgRed,
    'Uptime',
    consoleColor.FgWhite,
    ': ',
    client.loadingEndedAt
      ? Math.round((Date.now() - client.loadingEndedAt.getTime()) / 1000 / 60) + ' mins'
      : 'Loading...',
  ].join('')

  const strActions = [
    consoleColor.FgRed,
    'Actions',
    consoleColor.FgWhite,
    ': ',
    client.clientActions.size,
  ].join('')

  const strCommands = [
    consoleColor.FgRed,
    'Commands',
    consoleColor.FgWhite,
    ': ',
    client.localCommands.size,
  ].join('')

  const strOS = [
    consoleColor.FgRed,
    'OS: ',
    consoleColor.FgWhite,
    [os.version(), os.release(), os.platform()].join(' ') ?? 'none',
  ].join('')

  const strCPU = [
    consoleColor.FgRed,
    'CPU',
    consoleColor.FgWhite,
    ': ',
    os.cpus().shift()?.model ?? 'none',
  ].join('')

  const strMemory = [
    consoleColor.FgRed,
    'Memory',
    consoleColor.FgWhite,
    ': ',
    Math.round(process.memoryUsage().heapUsed / 1024 / 1024) ?? 'none',
    '[MiB]/',
    Math.round(process.memoryUsage().heapTotal / 1024 / 1024) ?? 'none',
    '[MiB]',
  ].join('')

  console.log(consoleColor.FgRed + '                ▄                   ' + strUserTag)
  console.log(consoleColor.FgRed + '              ▄▄▄▄▄                 ' + strSeparator)
  console.log(consoleColor.FgRed + '            ▄▄▄▄▄▄▄▄▄               ' + strClientName)
  console.log(consoleColor.FgRed + '         ▗  ▄▄▄▄▄▄▄▄▄  ▖            ' + strWS)
  console.log(consoleColor.FgRed + '        ▄▄▄   ▄▄▄▄▄   ▄▄▄           ' + strKernel)
  console.log(consoleColor.FgRed + '      ▄▄▄▄▄▄▄   ▄   ▄▄▄▄▄▄▄         ' + strUptime)
  console.log(consoleColor.FgRed + '    ▄▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄       ' + strActions)
  console.log(consoleColor.FgRed + '  ▄▄▄▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄▄▄     ' + strCommands)
  console.log(consoleColor.FgRed + '▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄   ' + strOS)
  console.log(consoleColor.FgRed + '                                    ' + strSeparator)
  console.log('        C Y B E R D Y N E           ' + strCPU)
  console.log('             SYSTEMS                ' + strMemory)
}

async function Main() {
  Print()

  await client.login(process.env.TOKEN || '')
  await client.setMaxListeners(0)

  Print()

  await loadActions(client).catch((error) => {
    logger.error('Error appears while actions loading')
    logger.error(error)
  })

  Print()

  await loadPlugins(client).catch((error) => {
    logger.error('Error appears while plugins loading')
    logger.error(error)
  })

  Print()

  await loadEvents(client).catch((error) => {
    logger.error('Error appears while events listeners creating')
    logger.error(error)
  })

  Print()

  await pushCommands(client).catch((error) => {
    logger.error('Error appears while updating commands')
    logger.error(error)
  })

  Print()

  await mongoose.connect(process.env.MONGODB_TOKEN || '').catch((error) => {
    logger.error('Error appears while connectiong to database')
    logger.error(error)
  })

  Print()

  client.loadingEndedAt = new Date()

  setInterval(() => {
    Print()
  }, 2000)
}

Main()
