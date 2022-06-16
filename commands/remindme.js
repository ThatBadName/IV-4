const { MessageEmbed } = require('discord.js')
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
        name: 'create',
        description: 'Create a reminder',
        type: 'SUB_COMMAND',
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
        ]
    },
    {
        name: 'list',
        description: 'Get a list of your active reminders',
        type: 'SUB_COMMAND'
    },
    {
        name: 'delete',
        description: 'Delete a reminder',
        type: 'SUB_COMMAND',
        options: [
            {
                name: 'id',
                description: 'The reminder ID',
                type: 'STRING',
                required: true
            }
        ]
    }
],
cooldown: '5s',
requireRoles: false,
permissions: ['SEND_MESSAGES'],

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
    if (interaction.options.getSubcommand() === 'create') {
        let reminder = interaction.options.getString('reminder') || 'do something'
        const delay = interaction.options.getString('remind-in')

        reminder = reminder.slice(0, 300)

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

        const result = await reminderSchema.find({guildId: interaction.guild.id, userId: interaction.user.id})
        if (result.length > 5) return interaction.reply({embeds: [new MessageEmbed().setTitle('You can only have 5 reminders at once').setColor('0xff0000')]})
        let password = [];
        let possible ='0123456789'
        let passString
        let passWordLength = 5
        for (let i = 0; i < passWordLength; i++) {
            password.push(possible.charAt(Math.floor(Math.random() * possible.length)));
        }
        passString = password.join('') 

        await reminderSchema.create({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
            channelId: interaction.channel.id,
            reminder: reminder,
            reminderSet: new Date(),
            expires: expires,
            reminderId: passString
        })

        interaction.reply({embeds: [new MessageEmbed().setTitle('New reminder set!').setColor('BLURPLE').setDescription(`I will remind you <t:${Math.round(expires.getTime() / 1000)}:R> to **${reminder}**`).setFooter({text: `ID: ${passString}`})]})
    } else if (interaction.options.getSubcommand() === 'list') {
        const userId = interaction.user.id
        const results = await reminderSchema.find({userId: userId, guildId: interaction.guild.id}).limit(5)
        if (results.length === 0) return interaction.reply({embeds: [new MessageEmbed().setTitle('No reminders set').setColor('0xff0000')]})
        let description = ``
        
        for (const reminder of results) {
            description += `**Reminder**: ${reminder.reminder}\n**Expires**: <t:${Math.round(reminder.expires.getTime() / 1000)}:R>\n**Set**: <t:${Math.round(reminder.reminderSet.getTime() / 1000)}>\n**ID**: \`${reminder.reminderId}\`\n\n`
        }
        const embedList = new MessageEmbed()
        .setTitle('Showing 5 reminders')
        .setColor('GOLD')
        .setDescription(description)
        interaction.reply({embeds: [embedList]})
    } else if (interaction.options.getSubcommand() === 'delete') {
        const ID = interaction.options.getString('id')
        const result = await reminderSchema.findOne({userId: interaction.user.id, guildId: interaction.guild.id, reminderId: ID})
        if (!result) return interaction.reply({embeds: [new MessageEmbed().setColor('0xff0000').setTitle('No reminder found with this ID')]})
        result.delete()
        interaction.reply({embeds: [new MessageEmbed().setTitle('Deleted reminder').setColor('0x00ffff')]})
    }
}
}