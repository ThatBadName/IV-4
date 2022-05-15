const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'lock',
    description: 'Locks/unlocks a voice or text channel for the @everyone role.',
    category: 'Moderation',

    permissions: ['MANAGE_CHANNELS'],
    slash: true,
    guildOnly: true,

    options: [
        {
            name: 'channel',
            description: 'The channel that you would like to lock',
            required: true,
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT', 'GUILD_NEWS', 'GUILD_VOICE'],
        },
        {
            name: 'announce',
            description: 'The channel that you would like to announce the channel lock in',
            required: true,
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT', 'GUILD_PRIVATE_THREAD', 'GUILD_PUBLIC_THREAD', 'GUILD_NEWS_THREAD', 'GUILD_NEWS'],
        },
        {
            name: 'state',
            description: 'Whether to lock/unlock the channel',
            required: 'true',
            type: 'STRING',
            choices: [
                {
                    name: 'lock',
                    description: 'Lock the given channel',
                    value: 'lock',
                },
                {
                    name: 'unlock',
                    description: 'Lock the given channel',
                    value: 'unlock',
                },
            ],
        },
        {
            name: 'reason',
            description: 'The reason for locking the channel',
            required: false,
            type: 'STRING',
        },
    ],

    callback: async ({ interaction, guild, member: staff }) => {
        const blacklistSchema = require('../models/blacklist-schema')
        const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
        if (blacklist) {
            return
        }
        const maintenanceSchema = require('../models/mantenance-schema')
        const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance && interaction.user.id !== '804265795835265034') {

                return
            }
        const channel = interaction.options.getChannel('channel')
        const announceChannel = interaction.options.getChannel('announce')
        const state = interaction.options.getString('state')
        const reason = interaction.options.getString('reason') || 'None provided'

        const logChannel = guild.channels.cache.find(channel => channel.name === 'iv-logs')
        if (!logChannel) return ('I could not find a log channel. Please create one called "iv-logs"')

        if (state === 'lock') {
            channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SEND_MESSAGES: false, CONNECT: false, SPEAK: false, STREAM: false })
            //channel.permissionOverwrites.edit(channel.guild.roles.everyone, { CONNECT: false })

            const logEmbed = new MessageEmbed()
                .setColor('DARK_VIVID_PINK')
                .setTitle('LOCK')
                .addField("Staff:", `${staff}`)
                .addField("Reason:", `${reason}`)
                .addField("Channel:", `${channel}`)

                logChannel.send({embeds: [logEmbed]})

            const lockEmbed = new MessageEmbed()
                .setTitle('**__:warning:YOU HAVE NOT BEEN MUTED:warning:__**')
                .setDescription(`**${channel} has been locked**\nPlease do not message any staff saying that you are muted`)
                .addField('**Reason:**', `${reason}`)
                .setColor('RED')
            if (announceChannel.type === 'GUILD_TEXT') {
                announceChannel.send({ embeds: [lockEmbed] })
            }

        } else if (state === 'unlock') {
            channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SEND_MESSAGES: true, CONNECT: true, SPEAK: true, STREAM: true })
            //channel.permissionOverwrites.edit(channel.guild.roles.everyone, { CONNECT: true })

            const logEmbed = new MessageEmbed()
                .setColor('DARK_PURPLE')
                .setTitle('UNLOCK')
                .addField("Staff:", `${staff}`)
                .addField("Reason:", `${reason}`)
                .addField("Channel:", `${channel}`)

                logChannel.send({embeds: [logEmbed]})

            const unlockEmbed = new MessageEmbed()
                .setDescription(`${channel} unlocked`)
                .addField('**Reason:**', `${reason}`)
                .setColor('GREEN')
            if (announceChannel.type === 'GUILD_TEXT') {
                announceChannel.send({ embeds: [unlockEmbed] })
            }

        }

        return {
            custom: true,
            content: `${channel} has been ${state}ed`,
            ephemeral: true,
        }
    }
}