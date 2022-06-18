const { isInteractionButton } = require('discord-api-types/utils/v9')
const { MessageEmbed } = require('discord.js')
const blacklistSchema = require('../models/blacklist-schema')

module.exports = {
    name: 'blacklist',
    description: 'Manage the blacklist',
    category: 'Dev',
    slash: true,
    testOnly: true,
    guildOnly: true,
    ownerOnly: true,
    options: [
        {
            name: 'list',
            description: 'View the blacklist',
            type: 'SUB_COMMAND',
        },
        {
            name: 'add',
            description: 'Add a user to the blacklist',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'userid',
                    description: 'The ID of the user to blacklist',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'The reason of the blacklist',
                    type: 'STRING',
                    required: false,
                },
            ],
        },
        {
            name: 'remove',
            description: 'Remove a user from the blacklist',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'userid',
                    description: 'The ID of the user to remove from the blacklist',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'search',
            description: 'Search for a blacklisted user',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'userid',
                    description: 'The ID of the user to blacklist',
                    type: 'STRING',
                    required: true,
                },
            ]
        },
    ],
    callback: async({interaction}) => {
        const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
        if (blacklist) {
            return
        }

        if (interaction.options.getSubcommand() === 'list') {
            const blacklists = await blacklistSchema.find()

            let description = ``
    
            for (const blacklist of blacklists) {
                description += `**User:** <@${blacklist.userId}>\n`
                description += `**UserID:** \`${blacklist.userId}\`\n`
                description += `**Date:** \`${blacklist.createdAt.toLocaleString()}\`\n`
                description += `**Reason:** ${blacklist.reason}\n\n`
            }
            const embed = new MessageEmbed().setDescription(description.slice(0, 4000) || 'There are no users blacklisted').setColor('RANDOM')
            return embed
        } else if (interaction.options.getSubcommand() === 'add') {
            const userID = interaction.options.getString('userid')
            const reason = interaction.options.getString('reason') || 'None'
            blacklistSchema.create({
                userId: userID,
                reason: reason
            })
            interaction.reply({
                content: `<@${userID}> (${userID}) has been blacklisted from using the bot | ${reason}`,
                ephemeral: true,
            })
        } else if (interaction.options.getSubcommand() === 'remove') {
            const userID = interaction.options.getString('userid')
            const result = await blacklistSchema.findOne({
                userId: userID,
            })
            if (!result) {
                return `That user is not on the blacklist`
            }
            result.delete()
            interaction.reply({
                content: `<@${userID}> (${userID}) has been removed from the blacklist`,
                ephemeral: true,
            })
        } else if (interaction.options.getSubcommand() === 'search') {
            const userId = interaction.options.getString('userid')
            const result = await blacklistSchema.findOne({userId: userId})
            if (!result) return interaction.reply({embeds: [new MessageEmbed().setTitle('This user is not blacklisted').setColor('0xff0000')]})
            interaction.reply({embeds: [new MessageEmbed().setTitle('This user has been found in the blacklist').setColor('GOLD').setDescription(`**User**: <@${result.userId}>\n**User ID**: ${result.userId}\n**Date**: ${result.createdAt.toLocaleString()}\n**Reason**: \`${result.reason}\``)]})
        }
    }
}