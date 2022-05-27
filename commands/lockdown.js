const { MessageEmbed, Permissions } = require('discord.js')

module.exports = {
    name: 'lockdown',
    description: 'Locks the whole server for the @everyone role',
    category: 'Moderation',

    permissions: ['MANAGE_ROLES'],
    slash: true,
    guildOnly: true,

    options: [
        {
            name: 'announce',
            description: 'The channel that you would like to announce the lockdown in',
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
        //const channels = guild.channels.cache.filter(ch => ch.type !== 'category');
        const state = interaction.options.getString('state')
        const reason = interaction.options.getString('reason') || 'None provided'
        const everyone = guild.roles.everyone

        const logChannel = guild.channels.cache.find(channel => channel.name === 'iv-logs')
        if (!logChannel) return ('I could not find a log channel. Please create one called "iv-logs"')

        if (state === 'lock') {
            const channel = interaction.options.getChannel('announce')
            everyone.setPermissions(0n)

            const logEmbed = new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle('LOCKDOWN START')
                .addField("Staff:", `${staff}`)
                .addField("Reason:", `${reason}`)

                logChannel.send({embeds: [logEmbed]})

            const lockEmbed = new MessageEmbed()
            .setTitle('**__:warning:YOU HAVE NOT BEEN MUTED/PUNISHED:warning:__**')
            .setDescription(`**The server has been locked**\nPlease do not message any staff saying that you are muted/punished\nNobody can speak/view channels`)
            .addField('**Reason:**', `${reason}`)
            .setColor('RED')

                channel.send({embeds: [lockEmbed]})


        } else if (state === 'unlock') {
            const channel = interaction.options.getChannel('announce')
            everyone.setPermissions([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.CONNECT, Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY, Permissions.FLAGS.USE_APPLICATION_COMMANDS])

            const logEmbed = new MessageEmbed()
                .setColor('DARK_GOLD')
                .setTitle('LOCKDOWN END')
                .addField("Staff:", `${staff}`)
                .addField("Reason:", `${reason}`)

                logChannel.send({embeds: [logEmbed]})

            const unlockEmbed = new MessageEmbed()
                .setDescription(`Server unlocked`)
                .addField('**Reason:**', `${reason}`)
                .setColor('GREEN')
                channel.send({ embeds: [unlockEmbed] })

        }

        return {
            custom: true,
            content: `Server has been ${state}ed`,
            ephemeral: true,
        }
    }
}