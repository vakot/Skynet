import { client } from '@bot/index'
import { IEmbed, IMessageComponent, Message } from '@bot/models/message'
import {
  APIActionRowComponent,
  APIButtonComponent,
  APIEmbed,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from 'discord.js'
import express from 'express'

const router = express.Router()

router.post('/guild/:guild/channel/:channel/send', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('incompatible method')
    }

    const { guild: guildId, channel: channelId } = req.params
    const { message: messageId } = req.query

    if (!guildId) {
      return res.status(400).send('unresolved guild id')
    }
    if (!channelId) {
      return res.status(400).send('unresolved channel id')
    }
    if (!messageId || typeof messageId !== 'string') {
      return res.status(400).send('unresolved message id')
    }

    const guild = await client.guilds.fetch(guildId)

    if (!guild) {
      return res.status(404).send('unknown guild')
    }

    const channel = await guild.channels.fetch(channelId)

    if (!channel) {
      return res.status(404).send('unknown channel')
    }

    if (!channel.isTextBased()) {
      return res.status(403).send('channel is not text based')
    }

    const message = await Message.findById(messageId).populate('embeds').populate({
      path: 'components',
      model: 'message-component',
    })

    if (!message) {
      return res.status(404).send('unknown message')
    }

    const embeds: APIEmbed[] =
      message.embeds?.map((embed: IEmbed) => {
        const builder = new EmbedBuilder()

        builder.setTitle(embed.title || null)
        builder.setDescription(embed.description || null)
        builder.setColor(embed.color || null)
        builder.setURL(embed.url || null)
        builder.setAuthor(embed.author?.name ? embed.author : null)
        builder.setFooter(embed.footer?.text ? embed.footer : null)
        builder.setImage(embed.image?.url || null)
        builder.setThumbnail(embed.thumbnail?.url || null)
        builder.setFields(embed.fields || [])

        return builder.toJSON()
      }) || []

    const rowComponents: APIActionRowComponent<APIButtonComponent>[] =
      message.components?.map((row) => {
        const rowBuilder = new ActionRowBuilder<ButtonBuilder>()

        row.map(({ _id, component }: IMessageComponent) => {
          const builder = new ButtonBuilder()

          builder.setCustomId(_id.toString())
          builder.setDisabled(component.disabled || false)
          // builder.setEmoji(component.emoji || null)
          builder.setLabel(component.label || '<>')
          builder.setStyle(component.style || 2)

          rowBuilder.addComponents(builder)
        })

        return rowBuilder.toJSON()
      }) || []

    return res.status(200).json(
      await channel.send({
        content: message.content,
        embeds: embeds,
        components: rowComponents,
      })
    )
  } catch (error) {
    console.log(error)

    return res.status(500).send(error)
  }
})

export default router
