const { MessageEmbed } = require('discord.js')
const botSchema = require('../models/bot-schema')

module.exports = {
    name: 'botannounce',
    category: 'Dev',
    description: 'Set the bot announcement',
    testOnly: true,
    slash: true,
    guildOnly: true,
    ownerOnly: true,
    options: [
        {
            name: 'announcement',
            description: 'The announcement',
            type: 'STRING',
            required: true,
        },
    ],
    callback: async({interaction}) => {
        const blacklistSchema = require('../models/blacklist-schema')
        const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
        if (blacklist) {
            return
        }
        var announcement = interaction.options.getString('announcement')
        var announcement = announcement.replaceAll("/n/", "\n")

        botSchema.collection.deleteMany()
        botSchema.create({announcement: announcement})

        const embed = new MessageEmbed()
        .setTitle('New Announcement Set')
        .setDescription(`${announcement}`)
        .setColor('RANDOM')
        return embed

    }
}
