const { MessageEmbed } = require('discord.js')
const setupSchema = require('../models/setup-schema')
const levelrewardSchema = require('../models/levelreward-schema')
const welcomeSchema = require('../models/welcome-schema')

module.exports = {
    name: 'config',
    description: 'Setup the bot.',
    category: 'Config',
    slash: true,
    permissions: ['ADMINISTRATOR'],
    guildOnly: true,
    options: [
        {
            name: 'view',
            description: 'View the current setup',
            type: 'SUB_COMMAND'
        },
        {
            name: 'reset',
            description: 'Reset the config',
            type: 'SUB_COMMAND',
        },
        {
            name: 'support-role',
            description: 'Set the support role for ticketing',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'role',
                    description: 'The support role for ticketing',
                    type: 'ROLE',
                    required: true,
                },
            ],
        },
        {
            name: 'support-category',
            description: 'Set the support category for ticketing',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'category',
                    description: 'The category where tickets will be opened',
                    type: 'CHANNEL',
                    channelTypes: ['GUILD_CATEGORY'],
                    required: true,
                },
                {
                    name: 'category-closed',
                    description: 'The category where locked tickets will be sent',
                    type: 'CHANNEL',
                    channelTypes: ['GUILD_CATEGORY'],
                    required: true,  
                },
            ],
        },
        {
            name: 'moderation-code',
            description: 'Set the code required to take a moderation action',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'set',
                    description: 'Set the code',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'rankcard',
            description: 'Change the servers levelling display',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'enabled',
                    description: 'Is the rank card enabled',
                    type: 'BOOLEAN',
                    required: true,
                },
            ],
        },
        {
            name: 'appeal-form',
            description: 'Set the appeal form',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'link',
                    description: 'The link to the form',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'invite-link',
            description: 'The link users should use to rejoin the server if they are punished',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'link',
                    description: 'The invite link',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'welcome',
            description: 'Setup the welcome config',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'channel',
                    description: 'The welcome channel',
                    type: 'CHANNEL',
                    channelTypes: ['GUILD_TEXT'],
                    required: true
                },
                {
                    name: 'role',
                    description: 'The role to give when a member joins the server',
                    type: 'ROLE',
                    required: true
                },
                {
                    name: 'message',
                    description: 'The message to send when someone joins the server',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'reset',
                    description: 'Reset the welcome',
                    type: 'STRING',
                    choices: [{name: 'yes', value: 'yes'}],
                    required: false
                },
            ],
        },
        {
            name: 'level',
            description: 'Manage levelling rewards',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'add-reward',
                    description: 'Add a levelling reward',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'level',
                            description: 'The level required to get this role',
                            type: 'NUMBER',
                            required: true,
                        },
                        {
                            name: 'reward',
                            description: 'The reward for reaching this level',
                            type: 'ROLE',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove-reward',
                    description: 'Remove a leveling reward',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'role',
                            description: 'The role to remove',
                            type: 'ROLE',
                            required: true,
                        },
                    ],
                },
            ],
        },
    ],
    callback: async({interaction}) => {
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
            
        if (interaction.options.getSubcommand() === 'support-role') {
            const role = interaction.options.getRole('role')
            const roleID = role.id

            const doc = await setupSchema.findOneAndUpdate({
                guildId: interaction.guild.id
            }, {
                supportId: roleID
            })
            if(!doc) {
                await setupSchema.create({guildId: interaction.guild.id})
            }
            interaction.reply({
                content: `Set the support role to <@&${roleID}>`,
                ephemeral: true,
            })
        }

        else if (interaction.options.getSubcommand() === 'support-category') {
            const cat = interaction.options.getChannel('category')
            const catClosed = interaction.options.getChannel('category-closed')
            const catId = cat.id
            const catIdClosed = catClosed.id

            const doc1 = await setupSchema.findOneAndUpdate({
                guildId: interaction.guild.id
            }, {
                supportCatId: catId,
                supportCatIdClosed: catIdClosed

            })
            if(!doc1) {
                await setupSchema.create({guildId: interaction.guild.id})
            }
            interaction.reply({
                content: `Set the support category to <#${catId}>`,
                ephemeral: true,
            })
        }
        else if (interaction.options.getSubcommand() === 'invite-link') {
                const link = interaction.options.getString('link')
    
                const update = await setupSchema.findOneAndUpdate({
                    guildId: interaction.guild.id
                }, {
                    guildInvite: link
                })
                if(!update) {
                    await setupSchema.create({guildId: interaction.guild.id})
                }
                interaction.reply({content: `Set the invite to: ${link}`})
        }
        else if (interaction.options.getSubcommand() === 'appeal') {
                const link = interaction.options.getString('link')
                const update = await setupSchema.findOneAndUpdate({
                    guildId: interaction.guild.id
                }, {
                    guildAppeal: link
                })
                if(!update) {
                    await setupSchema.create({guildId: interaction.guild.id})
                }
                interaction.reply({content: `Set the appeal form to: ${link}`})
        }
        else if (interaction.options.getSubcommand() === 'view') {
            const doc = await setupSchema.findOne({
                guildId: interaction.guild.id
            })
            const doc2 = await welcomeSchema.findOne({guildId: interaction.guild.id})
            if (!doc2) {
                welcomeSchema.create({guildId: interaction.guild.id})
                return `I couldn't find this server in my database. Please try again`
            }
            if (!doc) {
                setupSchema.create({guildId: interaction.guild.id})
                return `I couldn't find this server in my database. Please try again`
            }

            const rewards = await levelrewardSchema.find({guildId: interaction.guild.id})
            if (!rewards) {
                levelrewardSchema.create({guildId: interaction.guild.id})
                return `I couldn't find this server in my database. Please try again`
            }

            var description = `**Level Rewards**\n`
            for (const reward of rewards) {
                description += `Level ${reward.level} - ${reward.role}\n`
            }

            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Bot Settings')
            .setDescription(description)
            .setFields(
                {name: `Support Role`, value: `${doc.supportId ? `<@&${doc.supportId}>` : 'None'}`, inline: true},
                {name: `Support Category Open`, value: `${doc.supportCatId ? `<#${doc.supportCatId}>` : 'None'}`, inline: true},
                {name: `Support Category Closed`, value: `${doc.supportCatIdClosed ? `<#${doc.supportCatIdClosed}>` : 'None'}`, inline: true},
                {name: 'Moderation Code', value: `${doc.code ? `\`${doc.code}\`` : 'None'}`, inline: true},
                {name: 'Rank Card Enabled', value: `${doc.rankCard ? 'Yes' : 'No'}`, inline: true},
                {name: 'Server Invite', value: `${doc.guildInvite || 'None'}`, inline: true},
                {name: 'Server Appeal Form', value: `${doc.guildAppeal || 'None'}`},
                {name: 'Welcome Channel', value: `${doc2.wcId ? `<#${doc2.wcId}>` : 'None'}`, inline: true},
                {name: 'Welcome Role', value: `${doc2.wrId ? `<@&${doc2.wrId}>` : 'None'}`, inline: true},
                {name: 'Welcome Message', value: `${doc2.message ? `${doc2.message}` : 'None'}`, inline: false},
            )

            return embed
        }
        else if (interaction.options.getSubcommand() === 'rankcard') {
            const doc = await setupSchema.findOneAndUpdate({
                guildId: interaction.guild.id
            }, {
                rankCard: interaction.options.getBoolean('enabled')
            })
            if(!doc) {
                await setupSchema.create({guildId: interaction.guild.id})
            }
            interaction.reply({
                content: `Rank card set to: ${interaction.options.getBoolean('enabled')}`,
                ephemeral: true,
            })
        }
        else if (interaction.options.getSubcommand() === 'moderation-code') {
            const newCode = interaction.options.getString('set')

            const doc = await setupSchema.findOneAndUpdate({
                guildId: interaction.guild.id
            }, {
                code: newCode,
            })
            if(!doc) {
                await setupSchema.create({guildId: interaction.guild.id, code: '0000'})
            }
            interaction.reply({
                content: `The moderation code has been updated to ||\`${newCode}\`||. It used to be ||\`${doc.code}\`||`,
                ephemeral: true,
            })
        }

        else if (interaction.options.getSubcommand() === 'reset') {
            const result = await setupSchema.findOne({guildId: interaction.guild.id})
            const result2 = await welcomeSchema.findOne({guildId: interaction.guild.id})
            if (result) {
                result.delete()
                result2.delete()
                levelrewardSchema.collection.deleteMany({guildId: interaction.guild.id})
                return 'Reset the config data'
            } else {
                return `There was no config set`
            }
        }
        else if (interaction.options.getSubcommand() === 'welcome') {
            if (interaction.options.getString('reset') === 'yes') {
                const result = await welcomeSchema.findOne({guildId: interaction.guild.id})
                result.delete()
                interaction.reply({content: 'Reset welcome'})
                return
            }
            if (!interaction.options.getChannel('channel') && !interaction.options.getRole('role')) {
                interaction.reply({content: 'You need to provide at least 1 thing'})
            }
            const result = await welcomeSchema.findOne({guildId: interaction.guild.id})
            const role = interaction.options.getRole('role')
            const channel = interaction.options.getChannel('channel')
            const message = interaction.options.getString('message')
            if (!result) {
                await welcomeSchema.create({
                    guildId: interaction.guild.id,
                    wcId: channel.id,
                    wrId: role.id,
                    message: message
                })
                interaction.reply({content: 'Setup welcome'})
            } else {
                await result.updateOne({wcId: channel.id || result.wcId, wrId: role.id || result.wrID, message: message || result.message})
                interaction.reply({content: 'Updated welcome'})
            }
        }



        else if (interaction.options.getSubcommandGroup() === 'level') {
            if (interaction.options.getSubcommand() === 'add-reward') {
                levelrewardSchema.create({
                    guildId: interaction.guild.id,
                    level: interaction.options.getNumber('level'),
                    role: interaction.options.getRole('reward')
                })
                interaction.reply({content: `Level ${interaction.options.getNumber('level')} will reward ${interaction.options.getRole('reward')}`, ephemeral: true})
            } else {
                const result = await levelrewardSchema.findOne({guildId: interaction.guild.id, role: interaction.options.getRole('role')})
                if (!result) {
                    return `Could not find a level reward with that role`
                }
                result.delete()
                return `Deleted that level reward`
            }
        }
    }
}
}