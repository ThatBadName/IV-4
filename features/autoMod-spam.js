const maintenanceSchema = require('../models/mantenance-schema')
let set = new Set()

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance && message.author.id !== '804265795835265034') {
                return
            }

    if(message.channel.type === 'DM') return; 
    if(message.author.bot) return;
    if(message.channel.name === 'spam') return;
    if(message.channel.id === '963476714124632126') return;
    if(message.member.permissions.has("ADMINISTRATOR")) return
    const checkEnabledAutomod = await setupSchema.findOne({guildId: message.guild.id, automodEnabled: false})
    if (checkEnabledAutomod) return

    const functions = require('../spam-check')
    functions.spamCheck(message, set, 2000)

    })
}
module.exports.config = {
    dbName: 'AUTOMOD_SPAM',
    displayName: 'Automod - Spam'
}