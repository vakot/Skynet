import { ButtonInteraction, Events } from 'discord.js'

import { Action } from '../../modules/models/action'

import { validateAction } from '../../utils/helpers/validateAction'

export default new Action({
  category: '🔒・Testing',
  data: { name: 'test-button' },

  event: Events.InteractionCreate,

  devsOnly: true,
  testOnly: true,
  cooldown: 10_000,

  async init(interaction: ButtonInteraction) {
    if (this.data.name !== interaction.customId) return

    return await this.execute(interaction)
  },

  async execute(interaction: ButtonInteraction) {
    const invalidation = validateAction(
      this,
      interaction.guild,
      interaction.user
    )

    if (invalidation) {
      return await interaction.reply({
        content: invalidation,
        ephemeral: true,
      })
    }

    return await interaction.reply({
      content:
        "We're no strangers to love\n" +
        'You know the rules and so do I (do I)\n' +
        "A full commitment's what I'm thinking of\n" +
        "You wouldn't get this from any other guy\n" +
        '\n' +
        "I just wanna tell you how I'm feeling\n" +
        'Gotta make you understand\n' +
        '\n' +
        'Never gonna give you up\n' +
        'Never gonna let you down\n' +
        'Never gonna run around and desert you\n' +
        'Never gonna make you cry\n' +
        'Never gonna say goodbye\n' +
        'Never gonna tell a lie and hurt you\n' +
        '\n' +
        "We've known each other for so long\n" +
        "Your heart's been aching, but you're too shy to say it (say it)\n" +
        "Inside, we both know what's been going on (going on)\n" +
        "We know the game and we're gonna play it\n" +
        '\n' +
        "And if you ask me how I'm feeling\n" +
        "Don't tell me you're too blind to see\n" +
        '\n' +
        'Never gonna give you up\n' +
        'Never gonna let you down\n' +
        'Never gonna run around and desert you\n' +
        'Never gonna make you cry\n' +
        'Never gonna say goodbye\n' +
        'Never gonna tell a lie and hurt you\n' +
        '\n' +
        'Never gonna give you up\n' +
        'Never gonna let you down\n' +
        'Never gonna run around and desert you\n' +
        'Never gonna make you cry\n' +
        'Never gonna say goodbye\n' +
        'Never gonna tell a lie and hurt you\n' +
        '\n' +
        "We've known each other for so long\n" +
        "Your heart's been aching, but you're too shy to say it (to say it)\n" +
        "Inside, we both know what's been going on (going on)\n" +
        "We know the game and we're gonna play it\n" +
        '\n' +
        "I just wanna tell you how I'm feeling\n" +
        'Gotta make you understand\n' +
        '\n' +
        'Never gonna give you up\n' +
        'Never gonna let you down\n' +
        'Never gonna run around and desert you\n' +
        'Never gonna make you cry\n' +
        'Never gonna say goodbye\n' +
        'Never gonna tell a lie and hurt you\n' +
        '\n' +
        'Never gonna give you up\n' +
        'Never gonna let you down\n' +
        'Never gonna run around and desert you\n' +
        'Never gonna make you cry\n' +
        'Never gonna say goodbye\n' +
        'Never gonna tell a lie and hurt you\n' +
        '\n' +
        'Never gonna give you up\n' +
        'Never gonna let you down\n' +
        'Never gonna run around and desert you\n' +
        'Never gonna make you cry\n' +
        'Never gonna say goodbye\n' +
        'Never gonna tell a lie and hurt you',
      ephemeral: true,
    })
  },
})
