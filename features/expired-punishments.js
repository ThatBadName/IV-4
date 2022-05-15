//const punishmentSchema = require('../models/punishment-schema')
const path = require('path');
const punishmentSchema = require(path.join(__dirname, '../models/punishment-schema'));
const { MessageEmbed } = require('discord.js')

module.exports = (client) => {
    const check = async () => {
        const query = {
            expires: { $lt: new Date() },
        }
        const results = await punishmentSchema.find(query)

        for (const result of results) {
            const { guildId, userId, type } = result
            const guild = await client.guilds.fetch(guildId)
            if (!guild) {
                console.log(`Guild "${guildId}" no longer uses this bot`)
                continue
            }

                guild.members.unban(userId, 'Ban expired')
        }

        await punishmentSchema.deleteMany(query)
        setTimeout(check, 1000 * 60)
    }
    check()
}

module.exports.config = {
    dbName: 'EXPIRED PUNISHMENTS',
    displayName: 'Expired Punishments' 
}
