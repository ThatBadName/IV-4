const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'invitebot',
    description: 'Get the bot invite',
    category: 'Dev',
    testOnly: true,
    ownerOnly: true,
    guildOnly: true,
    slash: true,

    callback: async ({interaction}) => {
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
        const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setFields({
            name: 'Main Bot Invites', value: `[Required Permissions Invite](https://discord.com/api/oauth2/authorize?client_id=919242400738730005&permissions=1644972474359&scope=bot%20applications.commands)\n[Administrator Permissions Invite](https://discord.com/api/oauth2/authorize?client_id=919242400738730005&permissions=8&scope=bot%20applications.commands)\n[No Permissions Invite](https://discord.com/api/oauth2/authorize?client_id=919242400738730005&permissions=0&scope=bot%20applications.commands)`, inline: true,
        }, {
            name: 'Test Bot Invites', value: `[Required Permissions Invite](https://discord.com/api/oauth2/authorize?client_id=922516512441503754&permissions=1644972474359&scope=bot%20applications.commands)\n[Administrator Permissions Invite](https://discord.com/api/oauth2/authorize?client_id=922516512441503754&permissions=8&scope=bot%20applications.commands)\n[No Permissions Invite](https://discord.com/api/oauth2/authorize?client_id=922516512441503754&permissions=0&scope=bot%20applications.commands)`
        })
        .setFooter({text: 'Only bot owners can invite the bot'})
        return embed
    }
}