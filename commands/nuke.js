module.exports = {
    name: 'nuke',
    description: 'Nuke a channel',
    category: 'Moderation',
    guildOnly: true,
    permissions: ['ADMINISTRATOR'],
    slash: true,
    options: [
        {
            name: 'channel',
            description: 'The channel to nuke',
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT'],
            required: true,
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
            }

        const nuke = interaction.options.getChannel('channel')
        interaction.reply({content: `And it's gone`, ephemeral: true})
        
          nuke.clone().then(channel => {
            channel.setPosition(nuke.position)
            channel.send('Hmm I wonder what happened here...')
            channel.send('https://i.gifer.com/6Ip.gif')
          })
          nuke.delete()
    }
}