import { ApplicationCommand, SlashCommandBuilder } from 'discord.js'

export default function (
  localCommand: SlashCommandBuilder,
  applicationCommand: ApplicationCommand
): boolean {
  if (localCommand.name !== applicationCommand.name) {
    return false
  }
  if (localCommand.description !== applicationCommand.description) {
    return false
  }

  // TODO: other conditions

  return true
}
