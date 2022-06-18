const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const setupSchema = require('../models/setup-schema')
const ticketButtonsSchema = require('../models/ticketButton-schema')
const maintenanceSchema = require('../models/mantenance-schema')
const blacklistSchema = require('../models/blacklist-schema')

module.exports = (client) => {
    client.on('interactionCreate', async (interaction) => {
        const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
                if (blacklist) {
                    return
                }

            const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance && interaction.user.id !== '804265795835265034') {
                interaction.reply ({content: `Maintenance mode is currently enabled. You are not able to run any commands or interact with the bot. | Reason: ${maintenance.maintenanceReason ? maintenance.maintenanceReason : 'No Reason Provided'}`, ephemeral: true,})
                return
            }

        if (interaction.customId === 'other') {
            const guild = interaction.guild;
            const user = interaction.user
            const check = guild.channels.cache.find((c) => c.topic === `${user.id}`)
            const doc = await setupSchema.findOne({guildId: interaction.guild.id})
            const supportRoleId = doc.supportId
            const catId = doc.supportCatId
            const staff = doc.supportId
            const embed = new MessageEmbed()
                    .setTitle('Ticket | OTHER')
                    .setDescription('Hello,\nStaff will be with you as soon as possible. Meanwhile please tell us about your issue\nThank You!')
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
            
            if (!check) {
                const x = interaction.guild.channels.create(`${interaction.user.tag}`, {
                    permissionOverwrites: [{
                            id: interaction.user.id,
                            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES']
                        },
                        {
                            id: interaction.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL']
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
                    parent: catId,
                    topic: interaction.user.id
                }).then(async channel => {
                    const ticketMessage = await channel.send({
                        content: `Welcome <@${interaction.user.id}> <@&${staff}>`,
                        embeds: [embed],
                        components: [del]
                    })
                    const row = new MessageActionRow()
                    interaction.reply({
                        content: `Created ticket`,
                        ephemeral: true,
                        components: [row.addComponents(new MessageButton().setLabel('Go to the ticket').setStyle('LINK').setURL(`${ticketMessage.url}`))]
                    })
                    })
            } else {
                interaction.reply({
                    custom: true,
                    content: "You already have an open ticket",
                    ephemeral: true,
                })
            }
        } else if (interaction.customId === 'player') {

            const guild = interaction.guild;
            const user = interaction.user
            const check = guild.channels.cache.find((c) => c.topic === `${user.id}`)
            const doc = await setupSchema.findOne({guildId: interaction.guild.id})
            const supportRoleId = doc.supportId
            const catId = doc.supportCatId
            const staff = doc.supportId
            const embed = new MessageEmbed()
                    .setTitle('Ticket | PLAYER REPORT')
                    .setDescription('Hello,\nStaff will be with you as soon as possible. Meanwhile please tell us about your issue\nThank You!\n\n**Report Template:**\n\`\`\`**Offender:**\n**Reason:**\n**Proof:**\n**Other Notes:**\`\`\`')
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

            if (!check) {
                const x = interaction.guild.channels.create(`${interaction.user.tag}`, {
                    permissionOverwrites: [{
                            id: interaction.user.id,
                            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES']
                        },
                        {
                            id: interaction.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL']
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
                    parent: catId,
                    topic: interaction.user.id
                }).then(async channel => {
                    const ticketMessage = await channel.send({
                        content: `Welcome <@${interaction.user.id}> <@&${staff}>`,
                        embeds: [embed],
                        components: [del]
                    })
                    const row = new MessageActionRow()
                    interaction.reply({
                        content: `Created ticket`,
                        ephemeral: true,
                        components: [row.addComponents(new MessageButton().setLabel('Go to the ticket').setStyle('LINK').setURL(`${ticketMessage.url}`))]
                    })
                    })

                
            } else {
                interaction.reply({
                    custom: true,
                    content: "You already have an open ticket",
                    ephemeral: true,
                })
            }

        } else if (interaction.customId === 'staff') {

            const doc = await setupSchema.findOne({guildId: interaction.guild.id})
            const guild = interaction.guild;
            const user = interaction.user
            const check = guild.channels.cache.find((c) => c.topic === `${user.id}`)
            const catId = doc.supportCatId

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

                    const embed = new MessageEmbed()
                    .setTitle('Ticket | STAFF REPORT')
                    .setDescription('Hello,\nStaff will be with you as soon as possible. Meanwhile please tell us about your issue\nThank You!\n\n**Report Template:**\n\`\`\`fix\n**Bug:**\n**How you found it:**\n**Proof:**\n**Other Notes:**\n\`\`\`')
                    .setFooter({
                        text: 'Only staff can close tickets'
                    })
                    .setColor('GREEN')
                    .setTimestamp()
            if (!check) {
                const x = interaction.guild.channels.create(`${interaction.user.tag}`, {
                    permissionOverwrites: [{
                            id: interaction.user.id,
                            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES']
                        },
                        {
                            id: interaction.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL']
                        },
                        {
                            id: '919242400738730005',
                            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']
                        },
                    ],
                    type: 'text',
                    parent: catId,
                    topic: interaction.user.id
                }).then(async channel => {
                    const ticketMessage = await channel.send({
                        content: `Welcome <@${interaction.user.id}>`,
                        embeds: [embed],
                        components: [del]
                    })
                    const row = new MessageActionRow()
                    interaction.reply({
                        content: `Created ticket`,
                        ephemeral: true,
                        components: [row.addComponents(new MessageButton().setLabel('Go to the ticket').setStyle('LINK').setURL(`${ticketMessage.url}`))]
                    })
                    })
            } else {
                interaction.reply({
                    custom: true,
                    content: "You already have an open ticket",
                    ephemeral: true,
                })
            }

        } else if (interaction.customId === 'bug') {

            const guild = interaction.guild;
            const user = interaction.user
            const check = guild.channels.cache.find((c) => c.topic === `${user.id}`)
            const doc = await setupSchema.findOne({guildId: interaction.guild.id})
            const supportRoleId = doc.supportId
            const catId = doc.supportCatId
            const staff = doc.supportId
            const embed = new MessageEmbed()
                    .setTitle('Ticket | BUG REPORT')
                    .setDescription('Hello,\nStaff will be with you as soon as possible. Meanwhile please tell us about your issue\nThank You!\n\n**Report Template:**\n\`\`\`fix\n**Bug:**\n**How you found it:**\n**Proof:**\n**Other Notes:**\n\`\`\`')
                    .setFooter({text: 'Only the support team can delete tickets | Bugs must be reproduceable'})
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

            if (!check) {
                const x = interaction.guild.channels.create(`${interaction.user.tag}`, {
                    permissionOverwrites: [{
                            id: interaction.user.id,
                            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES']
                        },
                        {
                            id: interaction.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL']
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
                    parent: catId,
                    topic: interaction.user.id
                }).then(async channel => {
                    const ticketMessage = await channel.send({
                        content: `Welcome <@${interaction.user.id}> <@&${staff}>`,
                        embeds: [embed],
                        components: [del]
                    })
                    const row = new MessageActionRow()
                    interaction.reply({
                        content: `Created ticket`,
                        ephemeral: true,
                        components: [row.addComponents(new MessageButton().setLabel('Go to the ticket').setStyle('LINK').setURL(`${ticketMessage.url}`))]
                    })
                    })

            } else {
                interaction.reply({
                    custom: true,
                    content: "You already have an open ticket",
                    ephemeral: true,
                })
            }

        } else if (interaction.customId === 'feed') {

            const guild = interaction.guild;
            const user = interaction.user
            const check = guild.channels.cache.find((c) => c.topic === `${user.id}`)
            const doc = await setupSchema.findOne({guildId: interaction.guild.id})
            const supportRoleId = doc.supportId
            const catId = doc.supportCatId
            const staff = doc.supportId
            const embed = new MessageEmbed()
                    .setTitle('Ticket | FEEDBACK')
                    .setDescription('Hello,\nStaff will be with you as soon as possible. Meanwhile please tell us about your issue\nThank You!')
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

            if (!check) {
                const x = interaction.guild.channels.create(`${interaction.user.tag}`, {
                    permissionOverwrites: [{
                            id: interaction.user.id,
                            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES']
                        },
                        {
                            id: interaction.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL']
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
                    parent: catId,
                    topic: interaction.user.id
                }).then(async channel => {
                    const ticketMessage = await channel.send({
                        content: `Welcome <@${interaction.user.id}> <@&${staff}>`,
                        embeds: [embed],
                        components: [del]
                    })
                    const row = new MessageActionRow()
                    interaction.reply({
                        content: `Created ticket`,
                        ephemeral: true,
                        components: [row.addComponents(new MessageButton().setLabel('Go to the ticket').setStyle('LINK').setURL(`${ticketMessage.url}`))]
                    })
                    })

            } else {
                interaction.reply({
                    custom: true,
                    content: "You already have an open ticket",
                    ephemeral: true,
                })
            }
        } else if (interaction.customId === 'lock') {
            if (interaction.member.permissions.has('MANAGE_MESSAGES')) {
                const thread = interaction.channel
                const userThread = thread.topic
                const result = await ticketButtonsSchema.findOne({ticketId: thread.id, button: 'lock'})
                if (result) {
                    interaction.reply({content: `This button is on a cooldown. You can use it again <t:${Math.round(result.expires.getTime() / 1000)}:R>`, ephemeral: true})
                    return
                }

                const categoryId = await setupSchema.findOne({guildId: interaction.guild.id})
                if (!categoryId) return

                const catClose = categoryId.supportCatIdClosed

                if (thread.topic.includes('Locked')) {
                    interaction.reply({content: 'This ticket is already locked.', ephemeral: true})
                    return
                }
                    const lockEmbed = new MessageEmbed()
                        .setTitle('This ticket has been locked')
                        .setColor('RED')
                        interaction.channel.send({embeds: [lockEmbed]})

                        await thread.edit({name: 'locked-' + thread.name, topic: 'Locked - ' + thread.topic, parent: catClose})
                        thread.permissionOverwrites.edit(userThread, { VIEW_CHANNEL: false })

                        interaction.reply({custom: true, content: `Locked this ticket`, ephemeral: true})



                        const time = 10
                        const expires = new Date()
                        expires.setMinutes(expires.getMinutes() + time)

                        await new ticketButtonsSchema({
                            guildId: interaction.guild.id,
                            ticketId: thread.id,
                            expires: expires,
                            button: 'lock',
                        }).save()
                
            } else interaction.reply({custom: true, content: 'You cannot do this', ephemeral: true})

        } else if (interaction.customId === 'unlock') {
            if (interaction.member.permissions.has('MANAGE_MESSAGES')) {
                const thread = interaction.channel
                const userThread = thread.topic
                const result = await ticketButtonsSchema.findOne({ticketId: thread.id, button: 'unlock'})
                if (result) {
                    interaction.reply({content: `This button is on a cooldown. You can use it again <t:${Math.round(result.expires.getTime() / 1000)}:R>`, ephemeral: true})
                    return
                }

                const categoryIds = await setupSchema.findOne({guildId: interaction.guild.id})
                if (!categoryIds) return

                const catOpen = categoryIds.supportCatId

                if (!thread.topic.includes('Locked')) {
                    interaction.reply({content: 'This ticket is not locked.', ephemeral: true})
                    return
                }
                
                    const unlockEmbed = new MessageEmbed()
                        .setTitle('This ticket has been unlocked')
                        .setColor('GREEN')
                        interaction.channel.send({embeds: [unlockEmbed]})
        
                        await thread.edit({name: thread.name.slice(7), topic: thread.topic.slice(9), parent: catOpen})
                        thread.permissionOverwrites.edit(userThread.slice(9), { VIEW_CHANNEL: true })

                        interaction.reply({custom: true, content: `Unlocked this ticket`, ephemeral: true})



                        const time = 10
                        const expires = new Date()
                        expires.setMinutes(expires.getMinutes() + time)

                        await new ticketButtonsSchema({
                            guildId: interaction.guild.id,
                            ticketId: thread.id,
                            expires: expires,
                            button: 'unlock',
                        }).save()
                
            } else interaction.reply({custom: true, content: 'You cannot do this', ephemeral: true})

        }
    })
}

module.exports.config = {
    dbName: 'TICKET_CONTROLS',
    displayName: 'Ticket controls'
}