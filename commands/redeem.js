const premiumGuildSchema = require('../models/premiumGuild-schema')
const premiumCodeSchema = require('../models/premiumCode-schema')
const { MessageEmbed } = require('discord.js')

module.exports = {
name: 'redeem',
aliases: [''],
description: 'Redeem a code for premium',
category: 'Dev',
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
permissions: ['SEND_MESSAGES'],

callback: async({interaction}) => {
    let code = interaction.options.getString('code')

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
    if (plan === 'daily') time = 60 * 24
    if (plan === 'weekly') time = 60 * 24 * 7
    if (plan === 'monthly') time = 60 * 24 * 30
    if (plan === 'yearly') time = 60 * 24 * 365
    const epochTime = Math.round(date.setMinutes(date.getMinutes() + time) / 1000)

    const successEmbed = new MessageEmbed()
    .setTitle('You have claimed a code!')
    .setFields({
        name: 'Plan',
        value: `\`${premiumCode.plan}\``
    }, {
        name: 'Expires',
        value: `This servers premium will expire <t:${epochTime}:R>`
    })
    .setDescription(`Invite the premium bot [here](https://discord.com/api/oauth2/authorize?client_id=980386075014991912&permissions=1644971949559&scope=bot%20applications.commands)`)
    .setColor('GOLD')

    interaction.reply({embeds: [successEmbed]})
    await premiumGuildSchema.create({
        guildId: interaction.guild.id,
        expires: date.setMinutes(date.getMinutes() + time)
    })
    premiumCode.delete()
}
}