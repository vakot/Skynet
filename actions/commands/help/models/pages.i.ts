import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionReplyOptions,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from 'discord.js'

import { Action } from '@modules/models/action'
import { ICategory } from '@modules/models/category'
import { SkynetClient } from '@modules/models/client'

import { getCommandUsage } from '@utils/helpers/getCommandUsage'
import { getCategoryName } from '@utils/helpers/getCategoryName'

export interface IPage {
  embeds: EmbedBuilder[]
  components: ActionRowBuilder[]
}

export const Pages = {
  main(): InteractionReplyOptions {
    const InviteURL =
      'https://discord.com/api/oauth2/authorize?client_id=1094369819270316032&permissions=8&scope=applications.commands%20bot'

    const embed = new EmbedBuilder()
      .setTitle('Skynet help menu')
      .setDescription(
        '[Skynet](' +
          InviteURL +
          ") is the only all purpose bot you'll ever needed! It's can be fully customized with own actions to make anything real on your server!"
      )
      .setFields(
        {
          name: "`>_ ` Command's",
          value:
            ">>> In search of new command's and features? Browse through Skynet action's and find it out",
        },
        {
          name: "` ? ` FAQ's",
          value: ">>> Solution's for the most of frequently asked questions of bot user's",
        }
      )

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help-select-menu-base')
      .setPlaceholder('Select help option')
      .setOptions(
        {
          label: "Command's",
          value: 'commands',
          description: "List of all Skynet command's",
          emoji: '💬',
        },
        {
          label: "FAQ's",
          value: 'faq',
          description: 'Answers to common questions',
          emoji: '❓',
        },
        // {
        //   label: 'Setup',
        //   value: 'setup',
        //   emoji:  '⚙️' ,
        // },
        {
          label: 'Support Server',
          value: 'support-server',
          description: 'Join our support server',
        }
      )

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(menu)

    return {
      embeds: [embed],
      components: [row],
    }
  },

  faq(): InteractionReplyOptions {
    const embed = new EmbedBuilder().setTitle("FAQ's")

    return {
      embeds: [embed],
      components: [],
    }
  },

  commands(client: SkynetClient): InteractionReplyOptions {
    const embed = new EmbedBuilder()
      .setTitle('Skynet command categories')
      .setDescription(
        "Skynet command's separated to categories. Please choose which category you are interested for"
      )

    const categories = client.categories.filter((category) => !category?.private)

    categories.forEach((category) => {
      const commands = client.localCommands
        .filter((command) => command.category?.name === category.name)
        .map((command) => `\`/${command.data.name}\``)
        .sort()

      if (!commands.length) return

      embed.addFields({
        name: getCategoryName(category),
        value: commands.join('・'),
      })
    })

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help-select-menu-category')
      .setPlaceholder('Select category')

    categories.forEach((category) =>
      menu.addOptions({
        label: category.name,
        value: category.name,
        description: category.description,
        emoji: category.emoji,
      })
    )

    menu.addOptions({
      label: 'Return',
      value: 'return',
      description: 'Return back to main help menu',
      emoji: '↩️',
    })

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(menu)

    return {
      embeds: [embed],
      components: [row],
    }
  },

  category(category: ICategory, client: SkynetClient): InteractionReplyOptions {
    const embed = new EmbedBuilder().setTitle('``` ' + getCategoryName(category) + " ``` command's")

    if (category.description) {
      embed.setDescription(category.description)
    }

    const commands = client.localCommands
      .filter((command) => command.category?.name === category.name)
      .sort((a, b) => (a.data.name > b.data.name ? 1 : -1))

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help-select-menu-command')
      .setPlaceholder('Select command')

    let index = 0
    commands.forEach((command) => {
      const usage = getCommandUsage(command.data as SlashCommandBuilder)
      const description = command.data.description ?? '-'

      embed.addFields({
        name: usage.map((u) => '`' + u + '`').join(' '),
        value: '>>> ' + description,
        inline: true,
      })

      if (++index % 2 === 0) {
        embed.addFields({
          name: ' ',
          value: ' ',
        })
      }

      menu.addOptions({
        label: usage.join(' '),
        value: command.data.name,
        description: description,
      })
    })

    menu.addOptions({
      label: 'Return',
      value: 'return',
      description: 'Return back to categories menu',
      emoji: '↩️',
    })

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(menu)

    return {
      embeds: [embed],
      components: [row],
    }
  },

  command(command: Action, isAllowed: boolean = true): InteractionReplyOptions {
    const usage = getCommandUsage(command.data as SlashCommandBuilder)

    const embed = new EmbedBuilder().addFields(
      {
        name: 'Usage',
        value: `\`\`\`${usage.join(' ') || 'Unknown command'}\`\`\``,
        inline: true,
      },
      {
        name: 'Category',
        value: `\`\`\`${
          command.category ? getCategoryName(command.category) : 'Unknown category'
        }\`\`\``,
        inline: true,
      },
      { name: ' ', value: ' ' },
      {
        name: 'Description',
        value: `\`\`\`${command.data.description || '-'}\`\`\``,
        inline: true,
      },
      {
        name: 'Accessibility',
        value: `\`\`\`${isAllowed ? 'Disallowed' : 'Allowed'}\`\`\``,
        inline: true,
      }
    )

    const button = new ButtonBuilder()
      .setCustomId('help-button-command-return')
      .setLabel('Return')
      .setEmoji('↩️')
      .setStyle(ButtonStyle.Primary)

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button)

    return {
      embeds: [embed],
      components: [row],
    }
  },

  // .setFooter({
  //   text: '<option> - required ・ (option) - optional',
  //   iconURL: client.user?.displayAvatarURL(),
  // })
}
