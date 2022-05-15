const { MessageEmbed } = require("discord.js")

module.exports = {
    name: '8ball',
    description: 'How lucky are you',
    category: 'Fun',
    slash: true,
    guildOnly: true,
    cooldown: '5s',
    expectedArgs: '<question>',
    options: [
        {
            name: 'question',
            description: 'The question you want to ask',
            type: 'STRING',
            required: true,
        },
    ],
    callback: async ({interaction, user}) => {
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
        const question = interaction.options.getString('question')
        let answers = ['yes', 'no', 'deffinately', 'hmm not sure', 'seems like it', 'prehaps', 'certainly not', 'certainly', 'never', 'of course', 'better not tell you now', 'yus', 'noe', 'nope', 'im not telling u >:(', 'you would never be able to handle the truth']
        let result = Math.floor(Math.random() * answers.length)
        const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`${user.username}'s 8ball`)
        .setDescription(`**Question:**\n${question}\n\n**Answer:**\n${answers[result]}`)
        interaction.reply({embeds: [embed]})
            }
    }
}