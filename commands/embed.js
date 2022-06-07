const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'embed',
    description: 'Send a custom embed to a channel.',
    category: 'Dev',
    slash: true,
    ownerOnly: true,
    options: [
        {
            name: 'channel',
            description: 'The channel to send the embed to',
            required: true,
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT', 'GUILD_PRIVATE_THREAD', 'GUILD_PUBLIC_THREAD', 'GUILD_NEWS_THREAD', 'GUILD_NEWS'],
        },
        {
            name: 'timestamp',
            description: 'Whether or not to put a timestamp',
            required: true,
            type: 'BOOLEAN',
        },
        {
            name: 'author',
            description: 'The embed author',
            required: false,
            type: 'STRING',
        },
        {
            name: 'title',
            description: 'The embed title',
            required: false,
            type: 'STRING',
        },
        {
            name: 'url',
            description: 'The URL to put on the title',
            required: false,
            type: 'STRING',
        },
        {
            name: 'body',
            description: 'The main body text',
            required: false,
            type: 'STRING',
        },
        {
            name: 'footer',
            description: 'The embed footer',
            required: false,
            type: 'STRING',
        },
        {
            name: 'colour',
            description: 'The embed colour',
            required: false,
            type: 'STRING',
        },
        {
            name: 'image',
            description: 'The image for the embed',
            required: false,
            type: 'STRING',
        },
        {
            name: 'thumbnail',
            description: 'The thumbnail for the embed',
            required: false,
            type: 'STRING',
        },
    ],

    callback: async({ interaction, options }) => {
        const blacklistSchema = require('../models/blacklist-schema')
        const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
        if (blacklist) {
            return
        }
        const maintenanceSchema = require('../models/mantenance-schema')
        const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance && interaction.user.id !== '804265795835265034') {
                interaction.reply ({content: `Maintenance mode is currently enabled. You are not able to run any commands or interact with the bot. || ${maintenance.maintenanceReason ? maintenance.maintenanceReason : 'No Reason Provided'}`, ephemeral: true,})
                return
            }
        
        const messageChannel = options.getChannel('channel')

        const title = interaction.options.getString('title')
        const author = interaction.options.getString('author')
        var description = interaction.options.getString('body')
        const url = interaction.options.getString('url')
        let colour = interaction.options.getString('colour')
        const image = interaction.options.getString('image')
        const thumbnail = interaction.options.getString('thumbnail')
        const footer = interaction.options.getString('footer')

        if (!title && !author && !description && !image && !footer) return interaction.reply({content: 'You must provide at least 1 field', ephemeral: true})

        try {
            const embed = new MessageEmbed()
            .setTimestamp(interaction.options.getBoolean('timestamp'))
            if (title) embed.setTitle(title)
            if (author) embed.setAuthor({text: `${author}`})
            if (description) {description.replaceAll('/n/', '\n')
            embed.setDescription(description)}
            if (url) embed.setURL(url)
            if (colour) {
                let re = /[0-9A-Fa-f]{6}/g
                colour.replaceAll('#', '')
                if (re.test(colour)) {
                    embed.setColor(`0x${colour}`)
                } else embed.setColor('GREYPLE')
            }
            if (image) embed.setImage(image)
            if (thumbnail) embed.setThumbnail(thumbnail)
            if (footer) embed.setFooter({text: `${footer}`})

                messageChannel.send({embeds: [embed]}).then(interaction.reply({
                    custom: true,
                    content: 'Message sent',
                    ephemeral: true,
                }))
            } catch {
                interaction.reply({content: 'There was an error in your input', ephemeral: true})
            }
    }
}