const reminderSchema = require('../models/reminder-schema')

module.exports = {
name: 'remindme',
aliases: [''],
description: 'Get a reminder after some time',
category: 'Fun',
slash: true,
ownerOnly: false,
guildOnly: true,
testOnly: false,
options: [
    {
        name: 'remind-in',
        description: 'How long should I remind you in? (m=mins, h=hours, d=days)',
        type: 'STRING',
        required: true,
    },
    {
        name: 'reminder',
        description: 'What should I remind you about?',
        type: 'STRING',
        required: false,
    },
],
cooldown: '5s',
requireRoles: false,
permissions: ['SEND_MESSAGES'],

callback: async({interaction}) => {
    const reminder = interaction.options.getString('reminder') || 'do something'
    const delay = interaction.options.getString('remind-in')

    let time
    let type
    try {
        const split = delay.match(/\d+|\D+/g)
        time = parseInt(split[0])
        type = split[1].toLowerCase()

    } catch (e) {
        return "Invalid time format. Example format: \"10d\" where 'd' = days, 'h = hours and 'm' = minutes"
    }

    if (type === 'h') {
        time *= 60
    } else if (type === 'd') {
        time *= 60 * 24
    } else if (type !== 'm') {
        return 'Please use "m" (minutes), "h" (hours), "d" (days)'
    }

    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + time)

    await reminderSchema.create({
        guildId: interaction.guild.id,
        userId: interaction.user.id,
        channelId: interaction.channel.id,
        reminder: reminder,
        reminderSet: new Date(),
        expires: expires
    })

    interaction.reply({content: `I will remind you <t:${Math.round(expires.getTime() / 1000)}:R> to **${reminder}**`})
}
}