import { SkynetEvents } from '@bot/models/event'

export const executable = {
  [SkynetEvents.CommandInteraction]: `async function execute(client, interaction) {
  return interaction.reply({
    content: 'Hello from command, Skynet!',
    ephemeral: true
  })
}`,
  [SkynetEvents.ButtonInteraction]: `async function execute(client, interaction) {
  return interaction.reply({
    content: 'Hello from button, Skynet!',
    ephemeral: true
  })
}`,
  [SkynetEvents.SelectMenuInteraction]: `async function execute(client, interaction) {
  return interaction.reply({
    content: 'Hello from menu, Skynet!',
    ephemeral: true
  })
}`,
}
