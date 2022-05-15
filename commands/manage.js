const { MessageEmbed } = require('discord.js')
const historySchema = require('../models/history-schema')
const punishmentSchema = require('../models/punishment-schema')
const strikeSchema = require('../models/strike-schema')
const codeSchema = require('../models/setup-schema')
const setupSchema = require('../models/setup-schema')
const ms = require('ms')

module.exports = {
    name: 'manage',
    description: 'Perform a moderation action on a user',
    category: 'Moderation',
    slash: true,
    guildOnly: true,
    permissions: ['MANAGE_MESSAGES'],
    expectedArgs: '<type>',
    options: [
        {
            name: 'nickname',
            description: 'Moderate a users name',
            type: 'SUB_COMMAND',
            options: [
            {
                name: 'user',
                description: 'The user to punish',
                type: 'USER',
                required: true,
            },
            {
                name: 'code',
                description: 'Please enter the moderation code',
                type: 'STRING',
                required: true,
            },
            ],
        },
        {
            name: 'timeout',
            description: 'Timeout a user',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The user to punish',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'duration',
                    description: 'The duration of the punishment',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'The reason for the punishment',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'silent',
                    description: 'Whether or not to make the punishment public',
                    type: 'BOOLEAN',
                    required: true,
                },
                {
                    name: 'code',
                    description: 'Please enter the moderation code',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'remove-timeout',
            description: 'Remove a timeout from a user',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The user to remove the punishment from',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'code',
                    description: 'Please enter the moderation code',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'kick',
            description: 'Kick a user',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The user to punish',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'The reason for the punishment',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'silent',
                    description: 'Whether or not to make the punishment public',
                    type: 'BOOLEAN',
                    required: true,
                },
                {
                    name: 'code',
                    description: 'Please enter the moderation code',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'softban',
            description: 'Softban a user',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The user to punish',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'The reason for the punishment',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'silent',
                    description: 'Whether or not to make the punishment public',
                    type: 'BOOLEAN',
                    required: true,
                },
                {
                    name: 'code',
                    description: 'Please enter the moderation code',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'tempban',
            description: 'Tempban a user',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The user to punish',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'duration',
                    description: 'The duration of the punishment',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'The reason for the punishment',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'silent',
                    description: 'Whether or not to make the punishment public',
                    type: 'BOOLEAN',
                    required: true,
                },
                {
                    name: 'code',
                    description: 'Please enter the moderation code',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'ban',
            description: 'Ban a user',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The user to punish',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'The reason for the punishment',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'silent',
                    description: 'Whether or not to make the punishment public',
                    type: 'BOOLEAN',
                    required: true,
                },
                {
                    name: 'code',
                    description: 'Please enter the moderation code',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'forceban',
            description: 'Ban a user not in the server',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'userid',
                    description: 'The ID of the user to punish',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'The reason for the punishment',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'silent',
                    description: 'Whether or not to make the punishment public',
                    type: 'BOOLEAN',
                    required: true,
                },
                {
                    name: 'code',
                    description: 'Please enter the moderation code',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'history',
            description: 'Get a users moderation history',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The user to view the histoy of',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'type',
                    description: 'The type of punishments to view',
                    required: true,
                    type: 'STRING',
                    choices: [
                        {
                            name: 'strike',
                            value: 'strike',
                        },
                        {
                            name: 'timeout',
                            value: 'timeout',
                        },
                        {
                            name: 'kick',
                            value: 'kick',
                        },
                        {
                            name: 'softban',
                            value: 'softban',
                        },
                        {
                            name: 'tempban',
                            value: 'tempban',
                        },
                        {
                            name: 'ban',
                            value: 'ban',
                        },
                        {
                            name: 'all',
                            value: 'all',
                        },
                    ],
                },
                {
                    name: 'code',
                    description: 'Please enter the moderation code',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'strike',
            description: 'Manage a users strikes',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'add',
                    description: 'Gives the user a strike',
                    options: [
                        {
                            name: 'user',
                            type: 'USER',
                            description: 'The user to strike',
                            required: true,
                        },
                        {
                            name: 'reason',
                            type: 'STRING',
                            description: 'The reason for the strike',
                            required: true,
                        },
                        {
                            name: 'silent',
                            description: 'Whether or not to make the strike public',
                            type: 'BOOLEAN',
                            required: true,
                        },
                        {
                            name: 'code',
                            description: 'Please enter the moderation code',
                            type: 'STRING',
                            required: true,
                        },
                    ],
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'delete',
                    description: 'Deletes a users strike',
                    options: [
                        {
                            name: 'user',
                            type: 'USER',
                            description: 'The user to delete the strike from',
                            required: true,
                        },
                        {
                            name: 'id',
                            type: 'STRING',
                            description: 'The ID of the strike to delete',
                            required: true,
                        },
                        {
                            name: 'code',
                            description: 'Please enter the moderation code',
                            type: 'STRING',
                            required: true,
                        },
                    ],
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'list',
                    description: 'Lists all a users strikes',
                    options: [
                        {
                            name: 'user',
                            type: 'USER',
                            description: 'List the strikes of a user',
                            required: true,
                        },
                        {
                            name: 'code',
                            description: 'Please enter the moderation code',
                            type: 'STRING',
                            required: true,
                        },
                    ]
                }
            ],
        },
        {
            name: 'forcehistory',
            description: 'Get the moderation history of a user outside of the server',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'userid',
                    description: 'The ID of the user to view the histoy of',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'type',
                    description: 'The type of punishments to view',
                    required: true,
                    type: 'STRING',
                    choices: [
                        {
                            name: 'strike',
                            value: 'strike',
                        },
                        {
                            name: 'timeout',
                            value: 'timeout',
                        },
                        {
                            name: 'kick',
                            value: 'kick',
                        },
                        {
                            name: 'softban',
                            value: 'softban',
                        },
                        {
                            name: 'tempban',
                            value: 'tempban',
                        },
                        {
                            name: 'ban',
                            value: 'ban',
                        },
                        {
                            name: 'all',
                            value: 'all',
                        },
                    ],
                },
                {
                    name: 'code',
                    description: 'Please enter the moderation code',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
    ],

    callback: async({interaction, client, guild, member: staff}) => {        
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
        const db = await setupSchema.findOne({guildId: interaction.guild.id})

        const logChannel = guild.channels.cache.find(channel => channel.name === 'iv-logs')
        if (!logChannel) return ('I could not find a log channel. Please create one called "iv-logs"')
        
        if (interaction.options.getSubcommand() === 'timeout') {
            const offender = interaction.options.getMember('user')
            const mod = interaction.member
            const highOffender = offender.roles.highest
            const highMod = mod.roles.highest

            if (highOffender === highMod) return `You cannot punish someone with the same role as you`
            if (highOffender.position > highMod.position) return `You cannot punish a user with a higher role than you`
            if (offender.id === guild.ownerId) return `You cannot punish the server owner`

            const doc = await codeSchema.findOne({
                guildId: interaction.guild.id
            })
    
            if(interaction.options.getString('code') !== doc.code) {
                interaction.reply({
                    content: `\`${interaction.options.getString('code')}\` is not the correct code. No action has been taken`,
                    ephemeral: true,
                })
                console.log(`${interaction.user.tag} (${interaction.user.id}), who tried "${interaction.options.getString('code')}" as the code, has got the moderation code wrong while trying to perform the timeout command`)
                return
            }
            if(!interaction.member.permissions.has('MANAGE_MESSAGES')) return `You do not have permission to use this`
            const duration = interaction.options.getString('duration')
            const user = interaction.options.getUser('user')
            const silent = interaction.options.getBoolean('silent')
            const reason = interaction.options.getString('reason')

                const member = interaction.guild.members.cache.get(user.id)
                const timeInMs = ms(duration);

                try {
                    await member.timeout(timeInMs, reason).catch((err) => {
                        console.log(err)
                    })

                    historySchema.create({
                        userId: user?.id,
                        staffId: staff.id,
                        guildId: guild?.id,
                        duration,
                        reason,
                        type: 'timeout',
                    })
    
                    const embed = new MessageEmbed()
                        .setTitle('You have been timed-out')
                        .setDescription(`[Appeal here](${db.guildAppeal})`)
                        .addField("Server:", `${guild}`)
                        .addField("Reason:", `${reason}`)
                        .addField("Duration:", `\`${duration}\``)
                        .setColor('LUMINOUS_VIVID_PINK')
                    await user.send({
                        embeds: [embed]
                    }).catch((err) => {
                        console.log(err)
                    })
    
                        const logEmbed = new MessageEmbed()
                            .setTitle('TIMEOUT')
                            .setDescription(`${user} has been timed-out`)
                            .addField("Staff:", `${staff}`)
                            .addField("Reason:", `${reason}`)
                            .addField("Duration:", `\`${duration}\``)
                            .setColor('LUMINOUS_VIVID_PINK')
    
                        logChannel.send({
                            embeds: [logEmbed]
                        }).catch((err) => {
                            console.log(err)
                        })

                        if (silent === true) {
                            return ({custom: true, content: `${user} has been timed-out for \`${duration}\``, ephemeral: true})
                        } else {
                            return `${user} has been timed-out for \`${duration}\``
                        }
                } catch (err) {
                    console.log(err)
                }

        } else if (interaction.options.getSubcommand() === 'remove-timeout') {

            const offender = interaction.options.getMember('user')
            const mod = interaction.member
            const highOffender = offender.roles.highest
            const highMod = mod.roles.highest

            if (highOffender === highMod) return `You cannot punish someone with the same role as you`
            if (highOffender.position > highMod.position) return `You cannot punish a user with a higher role than you`
            if (offender.id === guild.ownerId) return `You cannot punish the server owner`

            const doc = await codeSchema.findOne({
                guildId: interaction.guild.id
            })
    
            if(interaction.options.getString('code') !== doc.code) {
                interaction.reply({
                    content: `\`${interaction.options.getString('code')}\` is not the correct code. No action has been taken`,
                    ephemeral: true,
                })
                console.log(`${interaction.user.tag} (${interaction.user.id}), who tried "${interaction.options.getString('code')}" as the code, has got the moderation code wrong while trying to perform the remove timeout command`)
                return
            }
            if(!interaction.member.permissions.has('MANAGE_MESSAGES')) return `You do not have permission to use this`
            const user = interaction.options.getUser('user')
            const member = interaction.guild.members.cache.get(user.id)

                        try {
                            await member.timeout(null).catch((err) => {
                            console.log(err)
                            })
                                interaction.reply({
                                custom: true,
                                content: `${user} has been removed from timeout`,
                                ephemeral: true,
                            })
    
                            const embed = new MessageEmbed()
                                .setTitle('You have been removed from timeout')
                                .addField("Server:", `${guild}`)
                                .setColor('LIGHT_GREY')
                            await user.send({
                                embeds: [embed]
                            }).catch((err) => {
                                console.log(err)
                            })
    
                                const logEmbed = new MessageEmbed()
                                    .setTitle('TIMEOUT')
                                    .setDescription(`${user} has been removed from timeout`)
                                    .addField("Staff:", `${member}`)
                                    .setColor('LIGHT_GREY')
    
                                logChannel.send({
                                    embeds: [logEmbed]
                                }).catch((err) => {
                                    console.log(err)
                                })
                        } catch (err) {
                            console.log(err)
                        }

        } else if (interaction.options.getSubcommand() === 'kick') {

            const offender = interaction.options.getMember('user')
            const mod = interaction.member
            const highOffender = offender.roles.highest
            const highMod = mod.roles.highest

            if (highOffender === highMod) return `You cannot punish someone with the same role as you`
            if (highOffender.position > highMod.position) return `You cannot punish a user with a higher role than you`
            if (offender.id === guild.ownerId) return `You cannot punish the server owner`

            const doc = await codeSchema.findOne({
                guildId: interaction.guild.id
            })
    
            if(interaction.options.getString('code') !== doc.code) {
                interaction.reply({
                    content: `\`${interaction.options.getString('code')}\` is not the correct code. No action has been taken`,
                    ephemeral: true,
                })
                console.log(`${interaction.user.tag} (${interaction.user.id}), who tried "${interaction.options.getString('code')}" as the code, has got the moderation code wrong while trying to perform the kick command`)
                return
            }
            if(!interaction.member.permissions.has('KICK_MEMBERS')) return `You do not have permission to use this`
            const user = interaction.options.getMember('user')
            const silent = interaction.options.getBoolean('silent')
            const reason = interaction.options.getString('reason')

            if (!user.kickable) {
            return {
                custom: true,
                content: 'I cannot kick that user',
                ephemeral: true
            }
        }

        historySchema.create({
            userId: user?.id,
            staffId: staff.id,
            guildId: guild?.id,
            reason,
            type: 'kick',
        })

        const logEmbed = new MessageEmbed()
                .setColor('NAVY')
                .setTitle('KICK')
                .setDescription(`${user} has been kicked`)
                .addField("Staff:", `${staff}`)
                .addField("Reason:", `${reason}`)

            logChannel.send({embeds: [logEmbed]})

        const embed = new MessageEmbed()
        .setColor('DARK_RED')
        .setTitle(`**You have been kicked**`)
        .addField("Server:", `${guild}`)
        .addField("Reason:", `${reason}`)
        .setDescription(`[Rejoin here](${db.guildInvite})`)

            await user.send({embeds: [embed]}).catch((err) => {
                console.log(err)
            })
            user.kick(reason)

            if (silent === true) {
                interaction.reply ({
                    custom: true,
                    content: `Successfully kicked <@${user.id}> for ${reason}`,
                    ephemeral: true,
                })
            } else if (silent === false) {
                interaction.reply (`Successfully kicked <@${user.id}> for ${reason}`)
            }
            
        } else if (interaction.options.getSubcommand() === 'softban') {

            const offender = interaction.options.getMember('user')
            const mod = interaction.member
            const highOffender = offender.roles.highest
            const highMod = mod.roles.highest

            if (highOffender === highMod) return `You cannot punish someone with the same role as you`
            if (highOffender.position > highMod.position) return `You cannot punish a user with a higher role than you`
            if (offender.id === guild.ownerId) return `You cannot punish the server owner`

            const doc = await codeSchema.findOne({
                guildId: interaction.guild.id
            })
    
            if(interaction.options.getString('code') !== doc.code) {
                interaction.reply({
                    content: `\`${interaction.options.getString('code')}\` is not the correct code. No action has been taken`,
                    ephemeral: true,
                })
                console.log(`${interaction.user.tag} (${interaction.user.id}), who tried "${interaction.options.getString('code')}" as the code, has got the moderation code wrong while trying to perform the softban command`)
                return
            }
            if(!interaction.member.permissions.has('KICK_MEMBERS')) return `You do not have permission to use this`
            const user = interaction.options.getMember('user')
            const silent = interaction.options.getBoolean('silent')
            const reason = interaction.options.getString('reason')

            if (!user.bannable) {
                return {
                    custom: true,
                    content: 'I cannot ban that user',
                    ephemeral: true
                }
            }
    
            historySchema.create({
                userId: user?.id,
                staffId: staff.id,
                guildId: guild?.id,
                reason,
                type: 'softban',
            })
    
            const embed = new MessageEmbed()
            .setColor('DARK_RED')
            .setTitle(`**You have been softbanned**`)
            .addField("Server:", `${guild}`)
            .addField("Reason:", `${reason}`)
            .setDescription(`[Rejoin here](${db.guildInvite})`)
    
            const logEmbed = new MessageEmbed()
            .setColor('RED')
            .setTitle('SOFTBAN')
            .setDescription(`${user} has been softbanned`)
            .addField("Staff:", `${staff}`)
            .addField("Reason:", `${reason}`)
    
                await user.send({embeds: [embed]}).catch((err) => {
                    console.log(err)
                })
                user.ban({
                    reason,
                    days: 7
                })
                guild.members.unban(user, 'Softban')
    
            logChannel.send({embeds: [logEmbed]})
    
            if (silent === true) {
                interaction.reply ({
                    custom: true,
                    content: `Successfully softbanned <@${user.id}> for ${reason}`,
                    ephemeral: true,
                })
            } else if (silent === false) {
                interaction.reply (`Successfully softbanned <@${user.id}> for ${reason}`)
            }
            
        } else if (interaction.options.getSubcommand() === 'tempban') {

            const offender = interaction.options.getMember('user')
            const mod = interaction.member
            const highOffender = offender.roles.highest
            const highMod = mod.roles.highest

            if (highOffender === highMod) return `You cannot punish someone with the same role as you`
            if (highOffender.position > highMod.position) return `You cannot punish a user with a higher role than you`
            if (offender.id === guild.ownerId) return `You cannot punish the server owner`

            const doc = await codeSchema.findOne({
                guildId: interaction.guild.id
            })
    
            if(interaction.options.getString('code') !== doc.code) {
                interaction.reply({
                    content: `\`${interaction.options.getString('code')}\` is not the correct code. No action has been taken`,
                    ephemeral: true,
                })
                console.log(`${interaction.user.tag} (${interaction.user.id}), who tried "${interaction.options.getString('code')}" as the code, has got the moderation code wrong while trying to perform the tempban command`)
                return
            }
            if(!interaction.member.permissions.has('BAN_MEMBERS')) return `You do not have permission to use this`
            const duration = interaction.options.getString('duration')
            const user = interaction.options.getMember('user')
            const silent = interaction.options.getBoolean('silent')
            const reason = interaction.options.getString('reason')

            userId = user.id

        let time
        let type
        try {
            const split = duration.match(/\d+|\D+/g)
            time = parseInt(split[0])
            type = split[1].toLowerCase()

        } catch (e) {
            return "Invalid time format. Example format: \"10d\" where 'd' = days, 'h = hours and 'm' = minutes"
        }

        if (type === 'h') {
            time *= 60
        } else if (type === 'd') {
            time *= 60 * 24
        } else if (type !== 'm') {
            return 'Please use "m" (minutes), "h" (hours), "d" (days)'
        }

        const expires = new Date()
        expires.setMinutes(expires.getMinutes() + time)

        const result = await punishmentSchema.findOne({
            guildId: guild.id,
            userId,
            type: 'ban',
        })
        if (result) {
            return `<@${userId}> is already banned`
        }

        historySchema.create({
            userId: user?.id,
            staffId: staff.id,
            guildId: guild?.id,
            reason,
            duration,
            type: 'tempban',
        })

        const logEmbed = new MessageEmbed()
        .setColor('FUCHSIA')
        .setTitle('TEMPBAN')
        .setDescription(`${user} has been temp-banned`)
        .addField("Staff:", `${staff}`)
        .addField("Reason:", `${reason}`)
        .addField("Duration:", `\`${duration}\``)
        .addField("Expires", `${expires}`)

        await logChannel.send({embeds: [logEmbed]})

        const embed = new MessageEmbed()
        .setColor('DARK_RED')
        .setTitle(`**You have been temporarily banned**`)
        .addField("Server:", `${guild}`)
        .addField("Reason:", `${reason}`)
        .addField("Duration:", `\`${duration}\``)
        .addField("Expires", `${expires}`)
        .setDescription(`[Appeal here](${db.guildAppeal})\n[Rejoin here](${db.guildInvite})`)

            await user.send({embeds: [embed]}).catch((err) => {
                console.log(err)
            })
        

        try {
            await guild.members.ban(userId, { reason })

            await new punishmentSchema({
                userId,
                guildId: guild.id,
                staffId: staff.id,
                reason,
                expires,
                type: 'ban',
            }).save()
        } catch (ignored) {
            return 'Cannot ban that user'
        }
        
        if (silent === true) {

            return ({
                custom: true,
                content: `Successfully banned <@${user.id}> for ${duration} (${reason})`,
                ephemeral: true,
            })
        } else {
            return `Successfully banned <@${user.id}> for ${duration} (${reason})`
        }
            
        } else if (interaction.options.getSubcommand() === 'ban') {

            const offender = interaction.options.getMember('user')
            const mod = interaction.member
            const highOffender = offender.roles.highest
            const highMod = mod.roles.highest

            if (highOffender === highMod) return `You cannot punish someone with the same role as you`
            if (highOffender.position > highMod.position) return `You cannot punish a user with a higher role than you`
            if (offender.id === guild.ownerId) return `You cannot punish the server owner`

            const doc = await codeSchema.findOne({
                guildId: interaction.guild.id
            })
    
            if(interaction.options.getString('code') !== doc.code) {
                interaction.reply({
                    content: `\`${interaction.options.getString('code')}\` is not the correct code. No action has been taken`,
                    ephemeral: true,
                })
                console.log(`${interaction.user.tag} (${interaction.user.id}), who tried "${interaction.options.getString('code')}" as the code, has got the moderation code wrong while trying to perform the ban command`)
                return
            }
            if(!interaction.member.permissions.has('BAN_MEMBERS')) return `You do not have permission to use this`
            const user = interaction.options.getMember('user')
            const silent = interaction.options.getBoolean('silent')
            const reason = interaction.options.getString('reason')

            if (!user.bannable) {
                return {
                    custom: true,
                    content: 'I cannot ban that user',
                    ephemeral: true
                }
            }
    
            historySchema.create({
                userId: user?.id,
                staffId: staff.id,
                guildId: guild?.id,
                reason,
                type: 'ban',
            })
    
            const embed = new MessageEmbed()
            .setColor('DARK_RED')
            .setTitle(`**You have been banned**`)
            .addField("Server:", `${guild}`)
            .addField("Reason:", `${reason}`)
            .addField("Duration:", '\`Eternal\`')
            .setDescription(`[Appeal here](${db.guildAppeal})\n[Rejoin here](${db.guildInvite})`)
    
            const logEmbed = new MessageEmbed()
            .setColor('RED')
            .setTitle('BAN')
            .setDescription(`${user} has been banned`)
            .addField("Staff:", `${staff}`)
            .addField("Reason:", `${reason}`)
            .addField("Duration:", '\`Eternal\`')
    
                await user.send({embeds: [embed]}).catch((err) => {
                    console.log(err)
                })
                user.ban({
                    reason,
                    days: 7
                })
    
            logChannel.send({embeds: [logEmbed]})
    
            if (silent === true) {
                interaction.reply ({
                    custom: true,
                    content: `Successfully banned <@${user.id}> for ${reason}`,
                    ephemeral: true,
                })
            } else if (silent === false) {
                interaction.reply (`Successfully banned <@${user.id}> for ${reason}`)
            }
            
        } else if (interaction.options.getSubcommand() === 'nickname') {

            const offender = interaction.options.getMember('user')
            const mod = interaction.member
            const highOffender = offender.roles.highest
            const highMod = mod.roles.highest

            if (highOffender === highMod) return `You cannot punish someone with the same role as you`
            if (highOffender.position > highMod.position) return `You cannot punish a user with a higher role than you`
            if (offender.id === guild.ownerId) return `You cannot punish the server owner`

            const doc = await codeSchema.findOne({
                guildId: interaction.guild.id
            })
    
            if(interaction.options.getString('code') !== doc.code) {
                interaction.reply({
                    content: `\`${interaction.options.getString('code')}\` is not the correct code. No action has been taken`,
                    ephemeral: true,
                })
                console.log(`${interaction.user.tag} (${interaction.user.id}), who tried "${interaction.options.getString('code')}" as the code, has got the moderation code wrong while trying to perform the nickname command`)
                return
            }
            if(!interaction.member.permissions.has('MANAGE_NICKNAMES')) return `You do not have permission to use this`
            const member = interaction.options.getMember('user')

            member.setNickname(`User ${member.id}`)
            interaction.reply({
                content: `Successfully changed ${member}'s name`,
                ephemeral: true,
            })
        } else if (interaction.options.getSubcommand() === 'forceban') {
            if (!interaction.member.permissions.has('ADMINISTRATOR')) `You cannot use this`

            const doc = await codeSchema.findOne({
                guildId: interaction.guild.id
            })
    
            if(interaction.options.getString('code') !== doc.code) {
                interaction.reply({
                    content: `\`${interaction.options.getString('code')}\` is not the correct code. No action has been taken`,
                    ephemeral: true,
                })
                console.log(`${interaction.user.tag} (${interaction.user.id}), who tried "${interaction.options.getString('code')}" as the code, has got the moderation code wrong while trying to perform the forceban command`)
                return
            }

            const user = interaction.options.getString('userid')
            const silent = interaction.options.getBoolean('silent')
            const reason = interaction.options.getString('reason')
    
            historySchema.create({
                userId: user,
                staffId: staff.id,
                guildId: guild?.id,
                reason,
                type: 'ban',
            })
    
            const embed = new MessageEmbed()
            .setColor('DARK_RED')
            .setTitle(`**You have been banned**`)
            .addField("Server:", `${guild}`)
            .addField("Reason:", `${reason}`)
            .addField("Duration:", '\`Eternal\`')
            .setDescription(`[Appeal here](${db.guildAppeal})\n[Rejoin here](${db.guildInvite})`)
    
            const logEmbed = new MessageEmbed()
            .setColor('RED')
            .setTitle('BAN')
            .setDescription(`<@${user}> has been banned`)
            .addField("Staff:", `${staff}`)
            .addField("Reason:", `${reason}`)
            .addField("Duration:", '\`Eternal\`')
    
                guild.members.ban(user, {reason, days: 7})
    
            logChannel.send({embeds: [logEmbed]})
    
            if (silent === true) {
                interaction.reply ({
                    custom: true,
                    content: `Successfully banned <@${user}> for ${reason}`,
                    ephemeral: true,
                })
            } else if (silent === false) {
                interaction.reply (`Successfully banned <@${user}> for ${reason}`)
            }
        } else if (interaction.options.getSubcommand() === 'history') {
            const doc = await codeSchema.findOne({
                guildId: interaction.guild.id
            })
    
            if(interaction.options.getString('code') !== doc.code) {
                interaction.reply({
                    content: `\`${interaction.options.getString('code')}\` is not the correct code. No action has been taken`,
                    ephemeral: true,
                })
                console.log(`${interaction.user.tag} (${interaction.user.id}), who tried "${interaction.options.getString('code')}" as the code, has got the moderation code wrong while trying to perform the history command`)
                return
            }
            const user = interaction.options.getUser('user')
        const type = interaction.options.getString('type')

        if (type === 'strike') {

            const strikes = await historySchema.find({
                userId: user?.id,
                guildId: guild?.id,
                type: type,
            })
    
            let description = `Strike history of <@${user?.id}>: \n\n`
    
            for (const strike of strikes) {
                description += `**ID:** \`${strike._id}\`\n`
                description += `**Staff:** <@${strike.staffId}>\n`
                description += `**Date:** \`${strike.createdAt.toLocaleString()}\`\n`
                description += `**Reason:** ${strike.reason}\n\n`
            }
    
            const embed = new MessageEmbed().setDescription(description).setColor('DARK_ORANGE')
            try {
                    await interaction.member.send({
                        embeds: [embed]
                    })
                    interaction.reply({
                        content: 'I have sent you a DM',
                        ephemeral: true,
                    })
                } catch (err) {
                    interaction.reply({
                        content: 'Please enable your DMs then try again',
                        ephemeral: true,
                    })
                    console.log(err)
                }

        } else if (type === 'timeout') {

            const timeouts = await historySchema.find({
                userId: user?.id,
                guildId: guild?.id,
                type: type,
            })
    
            let description = `Timeout history of <@${user?.id}>: \n\n`
    
            for (const timeout of timeouts) {
                description += `**Staff:** <@${timeout.staffId}>\n`
                description += `**Date:** \`${timeout.createdAt.toLocaleString()}\`\n`
                description += `**Duration** \`${timeout.duration}\`\n`
                description += `**Reason:** ${timeout.reason}\n\n`
            }
    
            const embed = new MessageEmbed().setDescription(description).setColor('DARK_ORANGE')
            try {
                    await interaction.member.send({
                        embeds: [embed]
                    })
                    interaction.reply({
                        content: 'I have sent you a DM',
                        ephemeral: true,
                    })
                } catch (err) {
                    interaction.reply({
                        content: 'Please enable your DMs then try again',
                        ephemeral: true,
                    })
                    console.log(err)
                }
            
        } else if (type === 'kick') {

            const kicks = await historySchema.find({
                userId: user?.id,
                guildId: guild?.id,
                type: type,
            })
    
            let description = `Kick history of <@${user?.id}>: \n\n`
    
            for (const kick of kicks) {
                description += `**Staff:** <@${kick.staffId}>\n`
                description += `**Date:** \`${kick.createdAt.toLocaleString()}\`\n`
                description += `**Reason:** ${kick.reason}\n\n`
            }
    
            const embed = new MessageEmbed().setDescription(description).setColor('DARK_ORANGE')
            try {
                    await interaction.member.send({
                        embeds: [embed]
                    })
                    interaction.reply({
                        content: 'I have sent you a DM',
                        ephemeral: true,
                    })
                } catch (err) {
                    interaction.reply({
                        content: 'Please enable your DMs then try again',
                        ephemeral: true,
                    })
                    console.log(err)
                }
            
        } else if (type === 'tempban') {

            const temps = await historySchema.find({
                userId: user?.id,
                guildId: guild?.id,
                type: type,
            })
    
            let description = `Tempban history of <@${user?.id}>: \n\n`
    
            for (const temp of temps) {
                description += `**Staff:** <@${temp.staffId}>\n`
                description += `**Date:** \`${temp.createdAt.toLocaleString()}\`\n`
                description += `**Duration** \`${temp.duration}\`\n`
                description += `**Reason:** ${temp.reason}\n\n`
            }
    
            const embed = new MessageEmbed().setDescription(description).setColor('DARK_ORANGE')
            try {
                    await interaction.member.send({
                        embeds: [embed]
                    })
                    interaction.reply({
                        content: 'I have sent you a DM',
                        ephemeral: true,
                    })
                } catch (err) {
                    interaction.reply({
                        content: 'Please enable your DMs then try again',
                        ephemeral: true,
                    })
                    console.log(err)
                }
            
        } else if (type === 'ban') {

            const bans = await historySchema.find({
                userId: user?.id,
                guildId: guild?.id,
                type: type,
            })
    
            let description = `Ban history of <@${user?.id}>: \n\n`
    
            for (const ban of bans) {
                description += `**Staff:** <@${ban.staffId}>\n`
                description += `**Date:** \`${ban.createdAt.toLocaleString()}\`\n`
                description += `**Reason:** ${ban.reason}\n\n`
            }
    
            const embed = new MessageEmbed().setDescription(description).setColor('DARK_ORANGE')
            try {
                    await interaction.member.send({
                        embeds: [embed]
                    })
                    interaction.reply({
                        content: 'I have sent you a DM',
                        ephemeral: true,
                    })
                } catch (err) {
                    interaction.reply({
                        content: 'Please enable your DMs then try again',
                        ephemeral: true,
                    })
                    console.log(err)
                }
        } else if (type === 'all') {

            const strikes = await historySchema.find({
                userId: user?.id,
                guildId: guild?.id,
                type: 'strike'
            })
    
            let description = `History of <@${user?.id}>\n**Strikes:**\n`
    
            for (const strike of strikes) {
                description += `> **ID:** \`${strike._id}\`\n`
                description += `> **Staff:** <@${strike.staffId}>\n`
                description += `> **Date:** \`${strike.createdAt.toLocaleString()}\`\n`
                description += `> **Reason:** ${strike.reason}\n\n`
            }

            //description += `\n--------------------------\n\n`

            const timeouts = await historySchema.find({
                userId: user?.id,
                guildId: guild?.id,
                type: 'timeout',
            })
    
            description += `**Timeouts**:\n`
    
            for (const timeout of timeouts) {
                description += `> **Staff:** <@${timeout.staffId}>\n`
                description += `> **Date:** \`${timeout.createdAt.toLocaleString()}\`\n`
                description += `> **Duration** \`${timeout.duration}\`\n`
                description += `> **Reason:** ${timeout.reason}\n\n`
            }

            //description += `\n--------------------------\n\n`

            const kicks = await historySchema.find({
                userId: user?.id,
                guildId: guild?.id,
                type: 'kick',
            })
    
            description += `**Kicks:**\n`
    
            for (const kick of kicks) {
                description += `> **Staff:** <@${kick.staffId}>\n`
                description += `> **Date:** \`${kick.createdAt.toLocaleString()}\`\n`
                description += `> **Reason:** ${kick.reason}\n\n`
            }

            //description += `\n--------------------------\n\n`

            const softbans = await historySchema.find({
                userId: user?.id,
                guildId: guild?.id,
                type: 'softban',
            })
    
            description += `**Softbans:** \n`
    
            for (const softban of softbans) {
                description += `> **Staff:** <@${softban.staffId}>\n`
                description += `> **Date:** \`${softban.createdAt.toLocaleString()}\`\n`
                description += `> **Reason:** ${softban.reason}\n\n`
            }
    

            const temps = await historySchema.find({
                userId: user?.id,
                guildId: guild?.id,
                type: 'tempban',
            })
    
            description += `**Tempbans:**\n`
    
            for (const temp of temps) {
                description += `> **Staff:** <@${temp.staffId}>\n`
                description += `> **Date:** \`${temp.createdAt.toLocaleString()}\`\n`
                description += `> **Duration** \`${temp.duration}\`\n`
                description += `> **Reason:** ${temp.reason}\n\n`
            }

            //description += `\n--------------------------\n\n`

            const bans = await historySchema.find({
                userId: user?.id,
                guildId: guild?.id,
                type: 'ban',
            })
    
            description += `**Bans:**\n`
    
            for (const ban of bans) {
                description += `> **Staff:** <@${ban.staffId}>\n`
                description += `> **Date:** \`${ban.createdAt.toLocaleString()}\`\n`
                description += `> **Reason:** ${ban.reason}\n\n`
            }

            //description += `\n--------------------------\n\n`

            
    
            const embed = new MessageEmbed().setDescription(description).setColor('DARK_ORANGE')

            if (embed.length > 4096) {
                return `I couldn't display this users history due to the character limit. Please try again but select a certain category to look at. Sorry for any inconvenience caused`
            } else {
                try {
                    await interaction.member.send({
                        embeds: [embed]
                    })
                    interaction.reply({
                        content: 'I have sent you a DM',
                        ephemeral: true,
                    })
                } catch (err) {
                    interaction.reply({
                        content: 'Please enable your DMs then try again',
                        ephemeral: true,
                    })
                    console.log(err)
                }
            }
        } else if (type === 'softban') {
                const softbans = await historySchema.find({
                    userId: user?.id,
                    guildId: guild?.id,
                    type: type,
                })
        
                let description = `Softban history of <@${user?.id}>: \n\n`
        
                for (const softban of softbans) {
                    description += `**Staff:** <@${softban.staffId}>\n`
                    description += `**Date:** \`${softban.createdAt.toLocaleString()}\`\n`
                    description += `**Reason:** ${softban.reason}\n\n`
                }
        
                const embed = new MessageEmbed().setDescription(description).setColor('DARK_ORANGE')
                try {
                    await interaction.member.send({
                        embeds: [embed]
                    })
                    interaction.reply({
                        content: 'I have sent you a DM',
                        ephemeral: true,
                    })
                } catch (err) {
                    interaction.reply({
                        content: 'Please enable your DMs then try again',
                        ephemeral: true,
                    })
                    console.log(err)
                }
        }

    } else if (interaction.options.getSubcommand() === 'forcehistory') {
        const doc = await codeSchema.findOne({
            guildId: interaction.guild.id
        })

        if(interaction.options.getString('code') !== doc.code) {
            interaction.reply({
                content: `\`${interaction.options.getString('code')}\` is not the correct code. No action has been taken`,
                ephemeral: true,
            })
            console.log(`${interaction.user.tag} (${interaction.user.id}), who tried "${interaction.options.getString('code')}" as the code, has got the moderation code wrong while trying to perform the forcehistory command`)
            return
        }
        const user = interaction.options.getString('userid')
        const type = interaction.options.getString('type')

        if (type === 'strike') {

            const strikes = await historySchema.find({
                userId: user,
                guildId: guild?.id,
                type: type,
            })
    
            let description = `Strike history of <@${user}>: \n\n`
    
            for (const strike of strikes) {
                description += `**ID:** \`${strike._id}\`\n`
                description += `**Staff:** <@${strike.staffId}>\n`
                description += `**Date:** \`${strike.createdAt.toLocaleString()}\`\n`
                description += `**Reason:** ${strike.reason}\n\n`
            }
    
            const embed = new MessageEmbed().setDescription(description).setColor('DARK_ORANGE')
            try {
                    await interaction.member.send({
                        embeds: [embed]
                    })
                    interaction.reply({
                        content: 'I have sent you a DM',
                        ephemeral: true,
                    })
                } catch (err) {
                    interaction.reply({
                        content: 'Please enable your DMs then try again',
                        ephemeral: true,
                    })
                    console.log(err)
                }

        } else if (type === 'timeout') {

            const timeouts = await historySchema.find({
                userId: user,
                guildId: guild?.id,
                type: type,
            })
    
            let description = `Timeout history of <@${user}>: \n\n`
    
            for (const timeout of timeouts) {
                description += `**Staff:** <@${timeout.staffId}>\n`
                description += `**Date:** \`${timeout.createdAt.toLocaleString()}\`\n`
                description += `**Duration** \`${timeout.duration}\`\n`
                description += `**Reason:** ${timeout.reason}\n\n`
            }
    
            const embed = new MessageEmbed().setDescription(description).setColor('DARK_ORANGE')
            try {
                    await interaction.member.send({
                        embeds: [embed]
                    })
                    interaction.reply({
                        content: 'I have sent you a DM',
                        ephemeral: true,
                    })
                } catch (err) {
                    interaction.reply({
                        content: 'Please enable your DMs then try again',
                        ephemeral: true,
                    })
                    console.log(err)
                }
            
        } else if (type === 'kick') {

            const kicks = await historySchema.find({
                userId: user,
                guildId: guild?.id,
                type: type,
            })
    
            let description = `Kick history of <@${user}>: \n\n`
    
            for (const kick of kicks) {
                description += `**Staff:** <@${kick.staffId}>\n`
                description += `**Date:** \`${kick.createdAt.toLocaleString()}\`\n`
                description += `**Reason:** ${kick.reason}\n\n`
            }
    
            const embed = new MessageEmbed().setDescription(description).setColor('DARK_ORANGE')
            try {
                    await interaction.member.send({
                        embeds: [embed]
                    })
                    interaction.reply({
                        content: 'I have sent you a DM',
                        ephemeral: true,
                    })
                } catch (err) {
                    interaction.reply({
                        content: 'Please enable your DMs then try again',
                        ephemeral: true,
                    })
                    console.log(err)
                }
            
        } else if (type === 'tempban') {

            const temps = await historySchema.find({
                userId: user,
                guildId: guild?.id,
                type: type,
            })
    
            let description = `Tempban history of <@${user}>: \n\n`
    
            for (const temp of temps) {
                description += `**Staff:** <@${temp.staffId}>\n`
                description += `**Date:** \`${temp.createdAt.toLocaleString()}\`\n`
                description += `**Duration** \`${temp.duration}\`\n`
                description += `**Reason:** ${temp.reason}\n\n`
            }
    
            const embed = new MessageEmbed().setDescription(description).setColor('DARK_ORANGE')
            try {
                    await interaction.member.send({
                        embeds: [embed]
                    })
                    interaction.reply({
                        content: 'I have sent you a DM',
                        ephemeral: true,
                    })
                } catch (err) {
                    interaction.reply({
                        content: 'Please enable your DMs then try again',
                        ephemeral: true,
                    })
                    console.log(err)
                }
            
        } else if (type === 'ban') {

            const bans = await historySchema.find({
                userId: user,
                guildId: guild?.id,
                type: type,
            })
    
            let description = `Ban history of <@${user}>: \n\n`
    
            for (const ban of bans) {
                description += `**Staff:** <@${ban.staffId}>\n`
                description += `**Date:** \`${ban.createdAt.toLocaleString()}\`\n`
                description += `**Reason:** ${ban.reason}\n\n`
            }
    
            const embed = new MessageEmbed().setDescription(description).setColor('DARK_ORANGE')
            try {
                    await interaction.member.send({
                        embeds: [embed]
                    })
                    interaction.reply({
                        content: 'I have sent you a DM',
                        ephemeral: true,
                    })
                } catch (err) {
                    interaction.reply({
                        content: 'Please enable your DMs then try again',
                        ephemeral: true,
                    })
                    console.log(err)
                }
        } else if (type === 'all') {

            const strikes = await historySchema.find({
                userId: user,
                guildId: guild?.id,
                type: 'strike'
            })
    
            let description = `History of <@${user}>\n**Strikes:**\n`
    
            for (const strike of strikes) {
                description += `> **ID:** \`${strike._id}\`\n`
                description += `> **Staff:** <@${strike.staffId}>\n`
                description += `> **Date:** \`${strike.createdAt.toLocaleString()}\`\n`
                description += `> **Reason:** ${strike.reason}\n\n`
            }

            //description += `\n--------------------------\n\n`

            const timeouts = await historySchema.find({
                userId: user,
                guildId: guild?.id,
                type: 'timeout',
            })
    
            description += `**Timeouts**:\n`
    
            for (const timeout of timeouts) {
                description += `> **Staff:** <@${timeout.staffId}>\n`
                description += `> **Date:** \`${timeout.createdAt.toLocaleString()}\`\n`
                description += `> **Duration** \`${timeout.duration}\`\n`
                description += `> **Reason:** ${timeout.reason}\n\n`
            }

            //description += `\n--------------------------\n\n`

            const kicks = await historySchema.find({
                userId: user,
                guildId: guild?.id,
                type: 'kick',
            })
    
            description += `**Kicks:**\n`
    
            for (const kick of kicks) {
                description += `> **Staff:** <@${kick.staffId}>\n`
                description += `> **Date:** \`${kick.createdAt.toLocaleString()}\`\n`
                description += `> **Reason:** ${kick.reason}\n\n`
            }

            //description += `\n--------------------------\n\n`

            const softbans = await historySchema.find({
                userId: user,
                guildId: guild?.id,
                type: 'softban',
            })
    
            description += `**Softbans:** \n`
    
            for (const softban of softbans) {
                description += `> **Staff:** <@${softban.staffId}>\n`
                description += `> **Date:** \`${softban.createdAt.toLocaleString()}\`\n`
                description += `> **Reason:** ${softban.reason}\n\n`
            }
    

            const temps = await historySchema.find({
                userId: user,
                guildId: guild?.id,
                type: 'tempban',
            })
    
            description += `**Tempbans:**\n`
    
            for (const temp of temps) {
                description += `> **Staff:** <@${temp.staffId}>\n`
                description += `> **Date:** \`${temp.createdAt.toLocaleString()}\`\n`
                description += `> **Duration** \`${temp.duration}\`\n`
                description += `> **Reason:** ${temp.reason}\n\n`
            }

            //description += `\n--------------------------\n\n`

            const bans = await historySchema.find({
                userId: user,
                guildId: guild?.id,
                type: 'ban',
            })
    
            description += `**Bans:**\n`
    
            for (const ban of bans) {
                description += `> **Staff:** <@${ban.staffId}>\n`
                description += `> **Date:** \`${ban.createdAt.toLocaleString()}\`\n`
                description += `> **Reason:** ${ban.reason}\n\n`
            }

            //description += `\n--------------------------\n\n`
    
            const embed = new MessageEmbed().setDescription(description).setColor('DARK_ORANGE')

            if (embed.length > 4096) {
                return `I couldn't display this users history due to the character limit. Please try again but select a certain category to look at. Sorry for any inconvenience caused`
            } else {
            try {
                    await interaction.member.send({
                        embeds: [embed]
                    })
                    interaction.reply({
                        content: 'I have sent you a DM',
                        ephemeral: true,
                    })
                } catch (err) {
                    interaction.reply({
                        content: 'Please enable your DMs then try again',
                        ephemeral: true,
                    })
                    console.log(err)
                }
            }
        } else if (type === 'softban') {
                const softbans = await historySchema.find({
                    userId: user,
                    guildId: guild?.id,
                    type: type,
                })
        
                let description = `Softban history of <@${user}>: \n\n`
        
                for (const softban of softbans) {
                    description += `**Staff:** <@${softban.staffId}>\n`
                    description += `**Date:** \`${softban.createdAt.toLocaleString()}\`\n`
                    description += `**Reason:** ${softban.reason}\n\n`
                }
        
                const embed = new MessageEmbed().setDescription(description).setColor('DARK_ORANGE')
                try {
                    await interaction.member.send({
                        embeds: [embed]
                    })
                    interaction.reply({
                        content: 'I have sent you a DM',
                        ephemeral: true,
                    })
                } catch (err) {
                    interaction.reply({
                        content: 'Please enable your DMs then try again',
                        ephemeral: true,
                    })
                    console.log(err)
                }
        }
    } else if (interaction.options.getSubcommandGroup() === 'strike') {

        const offender = interaction.options.getMember('user')
        const mod = interaction.member
        const highOffender = offender.roles.highest
        const highMod = mod.roles.highest

        if (highOffender === highMod) return `You cannot punish someone with the same role as you`
        if (highOffender.position > highMod.position) return `You cannot punish a user with a higher role than you`
        if (offender.id === guild.ownerId) return `You cannot punish the server owner`

        const doc = await codeSchema.findOne({
            guildId: interaction.guild.id
        })

        if(interaction.options.getString('code') !== doc.code) {
            interaction.reply({
                content: `\`${interaction.options.getString('code')}\` is not the correct code. No action has been taken`,
                ephemeral: true,
            })
            console.log(`${interaction.user.tag} (${interaction.user.id}), who tried "${interaction.options.getString('code')}" as the code, has got the moderation code wrong while trying to perform the strike command`)
            return
        }
        const subCommand = interaction.options.getSubcommand()
    const user = interaction.options.getUser('user')
    const reason = interaction.options.getString('reason')
    const id = interaction.options.getString('id')
    const silent = interaction.options.getBoolean('silent')

    if (subCommand === 'add') {
        const strike = await strikeSchema.create({
            userId: user?.id,
            staffId: staff.id,
            guildId: guild?.id,
            reason,
        })
        
        historySchema.create({
                userId: user?.id,
                staffId: staff.id,
                guildId: guild?.id,
                reason,
                punishmentId: strike.id,
                type: 'strike',
            })

        const logEmbed = new MessageEmbed()
            .setColor('PURPLE')
            .setTitle('STRIKE ADD')
            .setDescription(`${user} has been striken`)
            .addField("Staff:", `${staff}`)
            .addField("Reason:", `${reason}`)
            .addField("ID:", `\`${strike.id}\``)

        logChannel.send({embeds: [logEmbed]})

        const embed = new MessageEmbed()
            .setColor('DARK_RED')
            .setTitle(`**You have been striken**`)
            .addField("Server:", `${guild}`)
            .addField("Reason:", `${reason}`)
            .addField("ID:", `\`${strike.id}\``)
            .setDescription(`[Appeal here](${db.guildAppeal})`)
            .setFooter({text: 'To view all strikes do \'/liststrikes\''})

        await user.send({embeds: [embed]}).catch((err) => {
            console.log(err)
        })

        if (silent === true) {
            interaction.reply ({custom: true, content: `<@${user?.id}> has been striken with an ID of: \`${strike.id}\``, ephemeral: true})
        } else if (silent === false) {
            interaction.reply (`<@${user?.id}> has been striken with an ID of: \`${strike.id}\``)
        }

        
    } else if (subCommand === 'delete') {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return `You do not have permission to do that`

        try {
        const strike = await strikeSchema.findByIdAndDelete(id)

        const logEmbed = new MessageEmbed()
            .setColor('ORANGE')
            .setTitle('STRIKE REMOVE')
            .setDescription(`${user} has been unstriken`)
            .addField("Staff:", `${staff}`)
            .addField("ID:", `\`${strike.id}\``)

        logChannel.send({embeds: [logEmbed]})
        
        const embed = new MessageEmbed()
            .setColor('DARK_RED')
            .setTitle(`**You have had a strike removed**`)
            .addField("Server:", `${guild}`)
            .addField("ID:", `\`${strike.id}\``)
            // .addField("ID:", `\`${strikeId}\``)
            .setFooter({text: 'To view all strikes do \'/liststrikes\''})

        await user.send({embeds: [embed]}).catch((err) => {
            console.log(err)
        })

        return {
            custom: true,
            content: `<@${user?.id}> has has strike removed with ID of: \`${strike.id}\``,
            ephemeral: true,
            allowedMentions: {
                users: [],
        }
        }
    } catch(err) {
        return ({
            custom: true,
            content: 'Could not find a strike with that ID',
            ephemeral: true,
        })
    }

    } else if (subCommand === 'list') {
        const strikes = await strikeSchema.find({
            userId: user?.id,
            guildId: guild?.id,
        })

        let description = `All active strikes for <@${user?.id}>: \n\n`

        for (const strike of strikes) {
            description += `**ID:** \`${strike._id}\`\n`
            description += `**Date:** \`${strike.createdAt.toLocaleString()}\`\n`
            description += `**Staff:** <@${strike.staffId}>\n`
            description += `**Reason:** ${strike.reason}\n\n`
        }

        const embed = new MessageEmbed().setDescription(description).setColor('DARK_ORANGE')

        return embed
    }
}
}
}