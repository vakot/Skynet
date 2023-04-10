module.exports = {
  trigger: 'messageCreate',
  action: (message) => {
    if (!message.author.bot) {
      message.reply(message.content)
    }
  },
}
