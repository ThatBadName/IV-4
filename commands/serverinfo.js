const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
    name: 'serverinfo',
    description: 'Get info on the server',
    category: 'Fun',
    slash: true,
    cooldown: '3s',
    guildOnly: true,


    callback: async({interaction, guild}) => {
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
        
        const embed = new MessageEmbed()
        .setTitle(guild.name)
        .setThumbnail(guild.iconURL())
        .setColor('RANDOM')
        .addField("General Info", `**ID:** ${guild.id}\n**Name:** ${guild.name}\n**Owner:** <@${guild.ownerId}>`)
        .addField("Counts", `**Members:** ${guild.memberCount}\n**Roles:** ${guild.roles.cache.size}\n**Channels:** ${guild.channels.cache.size}\n**Emojis:** ${guild.emojis.cache.size} (${guild.emojis.cache.filter((e) => !e.animated).size} regular, ${guild.emojis.cache.filter((e) => e.animated).size} animated)`)
        .addField('Extra Info', `**Created:** ${moment(guild.createdTimestamp).format("LT")} ${moment(guild.createdTimestamp).format("LL")} ${moment(guild.createdTimestamp).fromNow()}\n**Boost Tier:** ${guild.premiumTier ? `Tier ${guild.premiumTier}` : "None"}\n**Boost Count:** ${guild.premiumSubscriptionCount || 0}`)

        return embed

    }
}