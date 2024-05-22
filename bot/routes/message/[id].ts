import { client } from '@bot/index'
import { IEmbed, Message } from '@bot/models/message'
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

router.get('/message/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const message = await Message.findById(req.params.id)

    if (!message) {
      return res.status(404).send('unknown message')
    }

    return res.status(200).json(message)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.patch('/message/:id', async (req, res) => {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).json('unresolved message')
    }

    const message = await Message.findByIdAndUpdate(req.params.id, req.body)

    if (!message) {
      return res.status(404).send('unknown message')
    }

    return res.status(200).json(message)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.post('/message/:id', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('incompatible method')
    }

    const { guild: guildId, channel: channelId } = req.query

    if (!guildId || typeof req.params.id !== 'string') {
      return res.status(400).send('unresolved guild id')
    }
    if (!channelId || typeof req.params.id !== 'string') {
      return res.status(400).send('unresolved channel id')
    }
    if (!req.params.id) {
      return res.status(400).send('unresolved message id')
    }

    const guild = await client.guilds.fetch(guildId as string)

    if (!guild) {
      return res.status(404).send('unknown guild')
    }

    const channel = await guild.channels.fetch(channelId as string)

    if (!channel) {
      return res.status(404).send('unknown channel')
    }

    if (!channel.isTextBased()) {
      return res.status(403).send('channel is not text based')
    }

    const message = await Message.findById(req.params.id).populate('embeds')

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
      message.components?.map(({ components }: { components: any[] }) => {
        const rowBuilder = new ActionRowBuilder<ButtonBuilder>()

        components.map((component) => {
          const builder = new ButtonBuilder()

          if (component.url) {
            builder.setURL(component.url)
          } else {
            builder.setCustomId(component.customId)
          }

          builder.setDisabled(component.disabled || false)
          // builder.setEmoji(component.emoji || null)
          builder.setLabel(component.label || 'Button')
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
    return res.status(500).send(error)
  }
})

export default router
