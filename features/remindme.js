const { MessageEmbed } = require('discord.js')
const reminderSchema = require('../models/reminder-schema')

module.exports = (client) => {
    const checkForReminders = async () => {
        const query = {
            expires: { $lt: new Date() },
        }

        const results = await reminderSchema.find(query)

        for (const result of results) {

            const { guildId, userId, channelId, reminder, reminderSet } = result

            const guild = await client.guilds.fetch(guildId)
            if (!guild) continue

            const channel = guild.channels.cache.get(channelId)
            if (!channel) continue

            const user = await client.users.fetch(userId).catch(() => null);
            if (!user) return

            const embed = new MessageEmbed()
            .setTitle('Reminder')
            .setDescription(`**${reminder}**\n\nSet <t:${Math.round(reminderSet.getTime() / 1000)}:R>`)
            .setColor('GOLD')

            await user.send({embeds: [embed]}).catch(() => {
                channel.send({content: `Reminder for <@${userId}>`, embeds: [embed]})
            })

        }

        await reminderSchema.deleteMany(query)

        setTimeout(checkForReminders, 1000 * 10)
    }
    checkForReminders()
}

module.exports.config = {
    dbName: 'EXPIRED REMINDERS',
    displayName: 'Expired REMINDERS' 
}
