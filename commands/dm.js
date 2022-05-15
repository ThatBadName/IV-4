const { MessageEmbed } = require('discord.js') 

module.exports = {
    name: 'dm',
    description: 'DM a member',
    category: 'Dev',
    ownerOnly: true,
    slash: true,
    options: [
        {
            name: 'user',
            description: 'The user to DM',
            required: true,
            type: 'USER',
        },
        {
            name: 'message',
            description: 'The message to send to the user',
            required: true,
            type: 'STRING',
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
                interaction.reply ({content: `Maintenance mode is currently enabled. You are not able to run any commands or interact with the bot. || ${maintenance.maintenanceReason ? maintenance.maintenanceReason : 'No Reason Provided'}`, ephemeral: true,})
                return
            }
        
        const target = interaction.options.getMember('user')
        const user = interaction.options.getUser('user')
        var message = interaction.options.getString('message')
        var message = message.replaceAll("/n/", "\n")

        try {
            const embed = new MessageEmbed()
            .setTitle(`Sent a message to ${user.tag}`)
            .setDescription(message)
            .setColor('RANDOM')
            target.send(message)
            return ({
                custom: true,
                embeds: [embed],
                ephemeral: true,
            })
        } catch (err) {
            console.log(err)
            return ({
                custom: true,
                content: 'Failed to send message',
                ephemeral: true,
            })
        }
    }

}