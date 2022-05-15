const afkSchema = require('../models/afk-schema')
const { MessageEmbed } = require('discord.js')

module.exports = {
name: 'afk',
aliases: [''],
description: 'Set your AFK',
category: 'Fun',
slash: true,
ownerOnly: false,
guildOnly: true,
testOnly: false,
options: [
    {
        name: 'reason',
        description: 'Why you are going AFK',
        type: 'STRING',
        required: false,
    },
],
cooldown: '1m',
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
    const reason = interaction.options.getString('reason') || 'No reason provided'
    const checkAfk = await afkSchema.findOne({guildId: interaction.guild.id, userId: interaction.user.id})
    if (checkAfk) {
        const embed = new MessageEmbed()
            .setTitle('Welcome back!')
            .setDescription(`You went afk <t:${Math.round(checkAfk.time.getTime() / 1000)}:R>`)
            .setColor('RANDOM')
        interaction.reply({embeds: [embed]})
        checkAfk.delete()
    }
    else {
        await afkSchema.create({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
            reason: reason,
            time: new Date()
        })
        const embed = new MessageEmbed()
        .setTitle('I have set your afk')
        .setDescription(`I have set your afk. Reason: ${reason}`)
        .setColor('RANDOM')
        interaction.reply({embeds: [embed]})
    }
}
}