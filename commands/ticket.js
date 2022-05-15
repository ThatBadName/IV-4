const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js')
const createTranscript = require('discord-html-transcripts')
const setupSchema = require('../models/setup-schema')

module.exports = {
    name: 'ticket',
    description: 'Ticket management (Can have multiple tickets with 1 user open)',
    category: 'Moderation',
    slash: true,
    permissions: ['MANAGE_MESSAGES'],
    guildOnly: true,
    options: [{
            name: 'create',
            description: 'Create a ticket with a certain user',
            type: 'SUB_COMMAND',
            options: [{
                    name: 'user',
                    description: 'The user to create a ticket with',
                    type: 'USER',
                    required: true,
                },
                {
                    name: "private",
                    description: "Whether the ticket is hidden from staff or not",
                    type: "BOOLEAN",
                    required: true,
                },
            ],
        },
        {
            name: 'delete',
            description: 'Delete a ticket with a certain user',
            type: 'SUB_COMMAND',
            options: [{
                name: 'ticket',
                description: 'The ticket to delete',
                type: 'CHANNEL',
                channelTypes: ['GUILD_TEXT'],
                required: true,
            },
        {
            name: 'reason',
            description: 'The reason you are deleting this ticket',
            type: 'STRING',
            required: false,
        }, ],
        },
        {
            name: 'add',
            description: 'Add a user to a ticket',
            type: 'SUB_COMMAND',
            options: [{
                    name: 'user',
                    description: 'The user to add to a ticket',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'ticket',
                    description: 'The ticket to add the user to',
                    required: true,
                    type: 'CHANNEL',
                    channelTypes: ['GUILD_TEXT'],
                },
            ],
        },
        {
            name: 'remove',
            description: 'Remove a user from a ticket',
            type: 'SUB_COMMAND',
            options: [{
                    name: 'user',
                    description: 'The user to remove from a ticket',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'ticket',
                    description: 'The ticket to remove the user from',
                    required: true,
                    type: 'CHANNEL',
                    channelTypes: ['GUILD_TEXT'],
                },
            ],
        },
    ],

    callback: async ({
        interaction,
        guild
    }) => {
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

        try {
            const action = interaction.options.getSubcommand('ticket')
            const user = interaction.options.getUser('user')
            var ticket = interaction.options.getChannel('ticket') || guild.channels.cache.find(channel => channel.topic === user.id)
            const private = interaction.options.getBoolean('private')
            const staff = interaction.user.id
            const doc = await setupSchema.findOne({guildId: interaction.guild.id})
            const supportRoleId = doc.supportId

            if (action === 'create') {
                if (private === false) {
                    interaction.guild.channels.create(`${user.tag}`, {
                        permissionOverwrites: [{
                                id: interaction.user.id,
                                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES']
                            },
                            {
                                id: interaction.guild.roles.everyone,
                                deny: ['VIEW_CHANNEL']
                            },
                            {
                                id: user.id,
                                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES']
                            },
                            {
                                id: supportRoleId,
                                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES'],
                                deny: ['MANAGE_CHANNELS', 'MANAGE_ROLES']
                            },
                            {
                                id: '919242400738730005',
                                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']
                            }
                        ],
                        type: 'text',
                        parent: doc.supportCatId,
                        topic: user.id
                    }).then(async channel => {
                        channel.send({
                            content: `Welcome <@${user.id}> <@${staff}>`,
                            embeds: [embed],
                            components: [del]
                        })
                    }).then(interaction.reply({
                        content: `Created ticket`,
                        ephemeral: true
                    }))

                    const embed = new MessageEmbed()
                        .setTitle('Ticket | FORCED')
                        .setDescription('Hello,\nYou have been forced into this ticket. Staff should soon be with you.\nThank You!')
                        .setColor('GREEN')
                        .setFooter({
                            text: 'Only staff can close tickets'
                        })
                        .setTimestamp()

                        const del = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                            .setCustomId('lock')
                            .setLabel('🔒 Lock Ticket')
                            .setStyle('SECONDARY')
                        )
                        .addComponents(
                            new MessageButton()
                            .setCustomId('unlock')
                            .setLabel('🔓 Unlock Ticket')
                            .setStyle('SUCCESS')
                        )
                } else {
                    interaction.guild.channels.create(`${user.tag}`, {
                        permissionOverwrites: [{
                                id: interaction.user.id,
                                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES']
                            },
                            {
                                id: interaction.guild.roles.everyone,
                                deny: ['VIEW_CHANNEL']
                            },
                            {
                                id: user.id,
                                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES']
                            },
                            {
                                id: "919242400738730005",
                                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']
                            }
                        ],
                        type: 'text',
                        parent: doc.supportCatId,
                        topic: user.id
                    }).then(async channel => {
                        channel.send({
                            content: `Welcome <@${user.id}> <@${staff}>`,
                            embeds: [embed],
                            components: [del]
                        })
                    }).then(interaction.reply({
                        content: `Created ticket`,
                        ephemeral: true
                    }))

                    const embed = new MessageEmbed()
                        .setTitle('Ticket | FORCED')
                        .setDescription('Hello,\nYou have been forced into this ticket. Staff should soon be with you.\nThank You!')
                        .setFooter({
                            text: 'Only staff can close tickets'
                        })
                        .setColor('GREEN')
                        .setTimestamp()

                        const del = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                            .setCustomId('lock')
                            .setLabel('🔒 Lock Ticket')
                            .setStyle('SECONDARY')
                        )
                        .addComponents(
                            new MessageButton()
                            .setCustomId('unlock')
                            .setLabel('🔓 Unlock Ticket')
                            .setStyle('SUCCESS')
                        )
                }

            } else if (action === 'delete') {
                const reason = interaction.options.getString('reason')
                const userThread = interaction.options.getChannel('ticket')
                if (!userThread.topic) {
                    interaction.reply({content: 'Thats not a ticket', ephemeral: true})
                    return
                }

                if (/^[0-9]{18}/g.test(userThread.topic.replace('Locked - ', ''))) {
                    interaction.reply({
                        custom: true,
                        content: 'Deleted that ticket',
                        ephemeral: true,
                    }).catch((err) => {interaction.reply('Thats not a ticket')})
                    const embedClose = new MessageEmbed()
                    .setTitle('New Transcript')
                    .setFields({name: 'Ticket Author', value: `<@${userThread.topic.replace('Locked - ', '')}>`, inline: true},
                        {name: 'Closed by', value: `${interaction.user}`},
                        {name: 'Reason', value: `${reason ? reason : 'None provided'}`})
                    .setColor('RANDOM')
                    const transcript = await createTranscript.createTranscript(ticket, {limit: -1, returnBuffer: false, fileName: `ticket-${ticket.name}.html`})
                    const logChannel = await interaction.guild.channels.cache.find(c => c.name === 'iv-transcripts')
                    if (!logChannel) {
                        const ch = await interaction.guild.channels.create(`iv-transcripts`, {id: interaction.guild.roles.everyone, deny: ['VIEW_CHANNEL']}, {id: '919242400738730005', allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']})
                        ch.send({embeds: [embedClose], files: [transcript]})
                        ticket.delete()
                    }
                    logChannel.send({embeds: [embedClose], files: [transcript]})
                    ticket.delete()
                } else {
                    interaction.reply({custom: true, content: 'Thats not a ticket', ephemeral: true})
                }

            } else if (action === 'add') {
                if (!ticket.topic) {
                    interaction.reply({content: 'Thats not a ticket', ephemeral: true})
                    return
                }

                if (!/^[0-9]{18}/g.test(ticket.topic.replace('Locked - ', ''))) return ({
                    custom: true,
                    content: 'That is not a valid ticket',
                    ephemeral: true,
                })
                ticket.permissionOverwrites.create(user, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    ADD_REACTIONS: true,
                    EMBED_LINKS: true,
                    ATTACH_FILES: true
                })
                interaction.reply({
                    custom: true,
                    content: `Added <@${user.id}> to ${ticket}`,
                    ephemeral: true,
                })

            } else if (action === 'remove') {
                if (!ticket.topic) {
                    interaction.reply({content: 'Thats not a ticket', ephemeral: true})
                    return
                }

                if (!/^[0-9]{18}/g.test(ticket.topic.replace('Locked - ', ''))) return ({
                    custom: true,
                    content: 'That is not a valid ticket',
                    ephemeral: true,
                })

                ticket.permissionOverwrites.delete(user.id)
                interaction.reply({
                    custom: true,
                    content: `Removed <@${user.id}> from ${ticket}`,
                    ephemeral: true,
                })

            }
        } catch (err) {
            console.log(err)
        }
    }
}