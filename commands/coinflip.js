module.exports = {
    category: 'Fun',
    description: 'Flips a coin',
    name: 'coinflip',
    slash: true,
    cooldown: '3s',
    guildOnly: true,

    callback: async({ message, interaction, channel, args, options }) => {
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
        
        const random = Math.round(Math.random())

        if (random === 0) {
        interaction.reply({
            content: `Its heads`,
        })
        } else if (random === 1) {
            interaction.reply({
                content: `Its tails`,
            })
        }
        
       }
       }
}