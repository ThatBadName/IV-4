const premiumGuildSchema = require('../models/premiumGuild-schema')
const premiumCodeSchema = require('../models/premiumCode-schema')
const premiumTimeoutSchema = require('../models/premiumExpiredTimeout-schema')
const { MessageEmbed } = require('discord.js')

module.exports = {
name: 'redeem',
aliases: [''],
description: 'Redeem a code for premium',
category: 'Admin',
slash: true,
ownerOnly: false,
guildOnly: true,
testOnly: false,
options: [
    {
        name: 'code',
        description: 'Enter the premium code',
        type: 'STRING',
        required: true
    },
],
cooldown: '',
requireRoles: false,
permissions: ['MANAGE_GUILD'],

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
    let code = interaction.options.getString('code')
    const check = await premiumTimeoutSchema.findOne({guildId: interaction.guild.id})

    let guild = await premiumGuildSchema.findOne({guildId: interaction.guild.id})

    const alreadyPremiumEmbed = new MessageEmbed()
    .setTitle('Could not give premium')
    .setDescription('This server is already premium')
    .setColor('RED')

    const invalidCodeEmbed = new MessageEmbed()
    .setTitle('Invalid code')
    .setDescription(`\`${code.toUpperCase()}\` is not a valid code. Please try again with a valid code`)
    .setColor('RED')

    if (guild) return interaction.reply({embeds: [alreadyPremiumEmbed]})

    const premiumCode = await premiumCodeSchema.findOne({code: code.toUpperCase()})
    if (!premiumCode) return interaction.reply({embeds: [invalidCodeEmbed]})

    const plan = premiumCode.plan
    const date = new Date()
    let time
    if (plan === 'daily') time = 1440
    if (plan === 'weekly') time = 60 * 24 * 7
    if (plan === 'monthly') time = 60 * 24 * 30
    if (plan === 'yearly') time = 60 * 24 * 365
    const duration = date.setMinutes(date.getMinutes() + time)

    const successEmbed = new MessageEmbed()
    .setTitle('You have claimed a code!')
    .setFields({
        name: 'Plan',
        value: `\`${premiumCode.plan}\``
    }, {
        name: 'Expires',
        value: `This servers premium will expire <t:${Math.round(duration / 1000)}:R>`
    }, {
        name: 'Code',
        value: `\`${code.toUpperCase()}\``
    })
    .setDescription(`Invite the premium bot [here](https://discord.com/api/oauth2/authorize?client_id=980386075014991912&permissions=1644971949559&scope=bot%20applications.commands)`)
    .setColor('GOLD')

    interaction.reply({embeds: [successEmbed]})
    await premiumGuildSchema.create({
        guildId: interaction.guild.id,
        expires: duration
    })
    premiumCode.delete()
    check.delete()
}
}