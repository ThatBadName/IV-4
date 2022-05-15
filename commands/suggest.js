const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const setupSchema = require('../models/setup-schema')

module.exports = {
    name: 'suggest',
    description: 'Suggest something',
    category: 'Fun',
    slash: true,
    options: [
                {
                    name: 'type',
                    description: 'Select the suggestion type',
                    required: true,
                    type: 'STRING',
                    choices: [
                        {
                            name: 'Server',
                            value: 'Server suggestion',
                        },
                        {
                            name: 'Bot',
                            value: 'Bot suggestion',
                        },
                        {
                            name: 'Other',
                            value: 'Other suggestion',
                        },
                        
                    ],
                },
                {
                    name: 'suggestion',
                    description: 'Your suggestion',
                    type: 'STRING',
                    required: true,
                },
            ],

    callback: async ({interaction, guild}) => {
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
        
        const channel = guild.channels.cache.find(channel => channel.name === 'suggestions')
        if (!channel) return ('I could not find a suggestion channel. Please create one called "suggestions"')

        const type = interaction.options.getString('type')
        const sug = interaction.options.getString('suggestion')

        const embed = new MessageEmbed()
        .setColor("WHITE")
        .setTitle(interaction.user.tag)
        .addField("Type", `${type}`)
        .addField("Suggestion", `${sug}`, true)
        const message = await channel.send({embeds: [embed], fetchReply: true});
            message.react("🟢")
            message.react("🔴")
            const thread = await message.startThread({
                name: `${interaction.user.tag}'s suggestion chat`,
                autoArchiveDuration: 60,
                reason: 'Automated Action',
            });
            thread.send(`Discuss this suggestion`)
        interaction.reply({custom: true, content: 'Sent your suggestion', ephemeral: true})
            
    }
}