const { MessageEmbed } = require('discord.js')
const rankSchema = require('../models/rank-schema')

module.exports = {
    name: 'rank',
    description: 'Manage/join a rank.',
    category: 'Misc',
    slash: true,
    guildOnly: true,
    cooldown: '3s',
    options: [
        {
            name: 'create',
            description: 'Create a new rank',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'name',
                    description: 'The name of the rank',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'description',
                    description: 'The description of the rank',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'role',
                    description: 'The role to be given for joining this rank',
                    type: 'ROLE',
                    required: true,
                },
            ],
        },
        {
            name: 'delete',
            description: 'Delete a rank',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'rank',
                    description: 'The name of the rank to remove',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'edit',
            description: 'Edit a rank',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'rank',
                    description: 'The rank to edit',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'new-name',
                    description: 'Change the name of the rank',
                    type: 'STRING',
                    required: false,
                },
                {
                    name: 'new-description',
                    description: 'Change the description of the rank',
                    type: 'STRING',
                    required: false,
                },
                {
                    name: 'new-role',
                    description: 'Change the role of the rank',
                    type: 'ROLE',
                    required: false,
                },
            ],
        },
        {
            name: 'view',
            description: 'View all the ranks',
            type: 'SUB_COMMAND',
        },
        {
            name: 'join',
            description: 'Join a rank',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'rank',
                    description: 'The name of the rank',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'leave',
            description: 'Leave a rank',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'rank',
                    description: 'The name of the rank',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
    ],

    callback: async ({interaction, guild, member}) => {
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
        
        if(interaction.options.getSubcommand() === 'create') {
            if(!member.permissions.has('ADMINISTRATOR')) return `You do not have permission to use this`

            const name = interaction.options.getString('name')
            const description = interaction.options.getString('description')
            const role = interaction.options.getRole('role')

            await rankSchema.create({
                guildId: interaction.guild.id,
                rankName: name,
                rankDescription: description,
                rankRole: role
            })

            const rankAddEmbed = new MessageEmbed()
            .setTitle('Created a new rank')
            .setColor('GREEN')
            .setFields(
                {
                    name: 'Rank Name',
                    value: `${name}`,
                    inline: true,
                }, {
                    name: 'Rank Description',
                    value: `${description}`,
                    inline: true,
                }, {
                    name: 'Item Role',
                    value: `${role}`,
                    inline: true,
                }
            )
            return rankAddEmbed
        } else if (interaction.options.getSubcommand() === 'delete') {
            if(!member.permissions.has('ADMINISTRATOR')) return `You do not have permission to use this`

            const name = await interaction.options.getString('rank')
            const result = await rankSchema.findOne({
                guildId: interaction.guild.id,
                rankName: name
            })

            if (!result) {
                return `Could not find rank with the name "${name}"`
            } else {
                const desc = result.rankDescription
                const role = result.rankRole
                result.delete()
                const rankRemoveEmbed = new MessageEmbed()
                    .setTitle('Deleted a rank')
                    .setFields(
                        {
                            name: 'Rank Name',
                            value: `${name}`,
                            inline: true,
                        }, {
                            name: 'Rank Description',
                            value: `${desc}`,
                            inline: true,
                        }, {
                            name: 'Rank Role',
                            value: `${role}`,
                            inline: true,
                        }
                    )
                    .setColor('RED')
                return rankRemoveEmbed
            }
            
        } else if (interaction.options.getSubcommand() === 'view') {
            const items = await rankSchema.find({guildId: interaction.guild.id,})

            let title = `Welcome to the IV-5 rank list`
            let description = ``

            for (const item of items) {
                description += `> **${item.rankName}**\n`
                description += `> **Description:** ${item.rankDescription}\n`
                description += `> **Role:** ${item.rankRole}\n\n`
            }
            const rankViewEmbed = new MessageEmbed().setTitle(title).setDescription(description).setColor('RANDOM')
            return rankViewEmbed
        } else if (interaction.options.getSubcommand() === 'join') {
                const name = interaction.options.getString('rank')
                const user = interaction.user
                const item = await rankSchema.findOne({
                    rankName: name,
                    guildId: interaction.guild.id,
                })

                if (!item) {
                    return `I could not find that rank`
                }
                    
                const role = item.rankRole.replace(/[<@!&>]/g, '')
                interaction.member.roles.add(role)

                interaction.reply({
                    content: `${user}, you have joined ${item.rankName}`,
                    ephemeral: true,
                })
            } else if (interaction.options.getSubcommand() === 'leave') {
                const name = interaction.options.getString('rank')
                const user = interaction.user
                const item = await rankSchema.findOne({
                    rankName: name,
                    guildId: interaction.guild.id,
                })

                if (!item) {
                    return `I could not find that rank`
                }
                    
                const role = item.rankRole.replace(/[<@!&>]/g, '')
                interaction.member.roles.remove(role)

                interaction.reply({
                    content: `${user}, you have left ${item.rankName}`,
                    ephemeral: true,
                })
            } else if (interaction.options.getSubcommand() === 'edit') {
            if(!member.permissions.has('ADMINISTRATOR')) return `You do not have permission to use this`
            const name = interaction.options.getString('rank')

            const item = await rankSchema.findOne({
                rankName: name,
                guildId: interaction.guild.id,
            })

            if(!item) {
                return `I could not find that rank`
            } else {
                    const oldName = item.rankName
                    const oldDesc = item.rankDescription
                    const oldRole = item.rankRole
                    const name = interaction.options.getString('new-name') || item.rankName
                    const description = interaction.options.getString('new-description') || item.rankDescription
                    const role = interaction.options.getRole('new-role') || item.rankRole
                    item.rankName = name,
                    item.rankDescription = description,
                    item.rankRole = role,
                    item.save()

                    const rankEditEmbed = new MessageEmbed()
                        .setTitle('Updated rank')
                        .setColor('GREEN')
                        .setFields(
                            {
                                name: 'Old Rank Name',
                                value: `${oldName}`,
                                inline: true,
                            }, {
                                name: 'New Rank Name',
                                value: `${name}`,
                                inline: true,
                            }, {
                                name: 'Old Rank Description',
                                value: `${oldDesc}`,
                                inline: true,
                            }, {
                                name: 'New Rank Description',
                                value: `${description}`,
                                inline: true,
                            }, {
                                name: 'Old Rank Role',
                                value: `${oldRole}`,
                                inline: true,
                            }, {
                                name: 'New Rank Role',
                                value: `${role}`,
                                inline: true,
                            }
                        )

                return rankEditEmbed
            }
        }
    }
}