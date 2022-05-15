const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'snipe',
    description: 'Snipe the last deleted message',
    category: 'Moderation',
    permissions: ['MANAGE_MESSAGES'],
    slashOnly: true,
    slash: true,

    callback: async({interaction, client}) => {
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
        
        let msg = db.get(`snipemsg_${interaction.channel.id}`)
        let senderid = db.get(`snipesender_${interaction.channel.id}`)
        if(!msg) {
            return `There is nothing to snipe. LOL`
        }
        let embed = new MessageEmbed()
        .setTitle(client.users.cache.get(senderid).username, client.users.cache.get(senderid).displayAvatarURL({ format: "png", dynamic: true }))
        .setDescription(msg)
        .setColor("RANDOM")
        .setTimestamp()
        interaction.reply({embeds: [embed]})
    }
}