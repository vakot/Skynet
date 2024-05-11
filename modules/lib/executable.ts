import { SkynetEvents } from '@bot/models/event'

export const executable = {
  [SkynetEvents.CommandInteraction]: `async function(client, interaction) {
  return interaction.reply({
    content: 'Hello, Skynet!',
    ephemeral: true
  })
}`,
}
