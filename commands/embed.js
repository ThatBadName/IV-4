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
            choices: [
                {
                    name: 'red',
                    description: 'Sets the embed colour to red',
                    value: '0xFF0000',
                },
                {
                    name: 'orange',
                    description: 'Sets the embed colour to orange',
                    value: '0xFF7700',
                },
                {
                    name: 'yellow',
                    description: 'Sets the embed colour to yellow',
                    value: '0xFFcc00',
                },
                {
                    name: 'lime',
                    description: 'Sets the embed colour to lime',
                    value: '0x10FF00',
                },
                {
                    name: 'green',
                    description: 'Sets the embed colour to green',
                    value: '0x005500',
                },
                {
                    name: 'aqua',
                    description: 'Sets the embed colour to aqua',
                    value: '0x00FFF8',
                },
                {
                    name: 'blue',
                    description: 'Sets the embed colour to blue',
                    value: '0x0000FF',
                },
                {
                    name: 'blurple',
                    description: 'Sets the embed colour to blurple',
                    value: '0x4E5D94',
                },
                {
                    name: 'purple',
                    description: 'Sets the embed colour to purple',
                    value: '0x4F00FF',
                },
                {
                    name: 'pink',
                    description: 'Sets the embed colour to pink',
                    value: '0xFF00FF',
                },
                {
                    name: 'brown',
                    description: 'Sets the embed colour to brown',
                    value: '0x482218',
                },
                {
                    name: 'maroon',
                    description: 'Sets the embed colour to maroon',
                    value: '0x300006',
                },
                {
                    name: 'white',
                    description: 'Sets the embed colour to white',
                    value: '0xFFFFFF',
                },
                {
                    name: 'black',
                    description: 'Sets the embed colour to black',
                    value: '0x000000',
                },
                {
                    name: 'grey',
                    description: 'Sets the embed colour to grey',
                    value: '0x777777',
                },

            ],
            
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
        const colour = interaction.options.getString('colour')
        const image = interaction.options.getString('image')
        const thumbnail = interaction.options.getString('thumbnail')
        const footer = interaction.options.getString('footer')

        const embed = new MessageEmbed()
        .setTimestamp(interaction.options.getBoolean('timestamp'))
        if (title) embed.setTitle(title)
        if (author) embed.setAuthor(author)
        if (description) {description.replaceAll('/n/', '\n')
        embed.setDescription(description)}
        if (url) embed.setURL(url)
        if (colour) embed.setColor(colour)
        if (image) embed.setImage(image)
        if (thumbnail) embed.setThumbnail(thumbnail)
        if (footer) embed.setFooter(footer)


        messageChannel.send({embeds: [embed]})

        interaction.reply({
            custom: true,
            content: 'Message sent',
            ephemeral: true,
        })
    }
}