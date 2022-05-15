const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "announce",
    description: "Make an announcement",
    category: 'Moderation',
    slash: true,
    guildOnly: true,
    permissions: ['MANAGE_GUILD'],
    expectedArgs: '<channel> <title> <announcement> <important> <anonymous> [ping]',
    options: [
        {
            name: 'channel',
            description: 'The announcemnt channel',
            required: true,
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT', 'GUILD_PRIVATE_THREAD', 'GUILD_PUBLIC_THREAD', 'GUILD_NEWS_THREAD', 'GUILD_NEWS'],
        },
        {
            name: 'title',
            description: 'The announcemnt title',
            required: true,
            type: 'STRING',
        },
        {
            name: 'announcement',
            description: 'The announcemnt',
            required: true,
            type: 'STRING',
        },
        {
            name: 'important',
            description: 'Whether or not the announcement is important',
            required: true,
            type: 'BOOLEAN',
        },
        {
            name: 'anonymous',
            description: 'Wheter or not the announcement is anonymous',
            required: true,
            type: 'BOOLEAN',
        },
        {
            name: 'ping',
            description: 'The role to ping',
            required: false,
            type: 'ROLE',
        },
    ],

    callback: async({interaction, user, guild}) => {
        const blacklistSchema = require('../models/blacklist-schema')
        const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
        if (blacklist) {
            return
        }
        const maintenanceSchema = require('../models/mantenance-schema')
        const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance && interaction.user.id !== '804265795835265034') {
                return
            } else {
        const channel = interaction.options.getChannel('channel')
        const title = interaction.options.getString('title')
        var announce = interaction.options.getString('announcement')
        const ping = interaction.options.getRole('ping')
        const important = interaction.options.getBoolean('important')
        const anon = interaction.options.getBoolean('anonymous')

        if (anon === false) {
            if (important === false) {
                var announce = announce.replaceAll("/n/", "\n")
                const embed = new MessageEmbed()
                .setAuthor(user.tag + ' has an announcement', user.displayAvatarURL({dynamic: true}))
                .setTitle(title)
                .setDescription(announce)
                .setColor('GOLD')
                .setTimestamp()
                if (!ping) {
                    channel.send({embeds: [embed]})
                } else {
                    channel.send({content: `${ping}`, embeds: [embed]})
                }
                } else {
                    var announce = announce.replaceAll("/n/", "\n")
                    const embed = new MessageEmbed()
                .setAuthor(user.tag + ' has an announcement', user.displayAvatarURL({dynamic: true}))
                .setTitle(title)
                .setDescription(announce)
                .setColor('RED')
                .setFooter('This announcement has been flagged as important')
                .setTimestamp()
                if (!ping) {
                    channel.send({embeds: [embed]})
                } else {
                    channel.send({content: `${ping}`, embeds: [embed]})
                }
                }
                interaction.reply({
                    custom: true,
                    content: `Announcement sent in ${channel}`,
                    ephemeral: true,
                })
        } else {
            if (important === false) {
                var announce = announce.replaceAll("/n/", "\n")
                const embed = new MessageEmbed()
                .setAuthor('Unknown#0000 has an announcement', guild.iconURL({dynamic: true}))
                .setTitle(title)
                .setDescription(announce)
                .setColor('GOLD')
                .setTimestamp()
                if (!ping) {
                    channel.send({embeds: [embed]})
                } else {
                    channel.send({content: `${ping}`, embeds: [embed]})
                }
                } else {
                    var announce =  announce.replaceAll("/n/", "\n")
                    const embed = new MessageEmbed()
                .setAuthor('Unknown#0000 has an announcement', guild.iconURL({dynamic: true}))
                .setTitle(title)
                .setDescription(announce)
                .setColor('RED')
                .setFooter('This announcement has been flagged as important')
                .setTimestamp()
                if (!ping) {
                    channel.send({embeds: [embed]})
                } else {
                    channel.send({content: `${ping}`, embeds: [embed]})
                }
                }
                interaction.reply({
                    custom: true,
                    content: `Announcement sent in ${channel}`,
                    ephemeral: true,
                })
            }
        }

        
    }
}
