const { MessageEmbed } = require('discord.js')
const premuimGuildsSchema = require('../models/premiumGuild-schema')
const setupSchema = require('../models/setup-schema')

module.exports = {
name: 'premium',
aliases: [''],
description: 'Manage a servers premium status',
category: 'Dev',
slash: true,
ownerOnly: true,
guildOnly: true,
testOnly: true,
options: [
    {
        name: 'add',
        description: 'Add premium to a server',
        type: 'SUB_COMMAND',
        options: [
            {
                name: 'server-id',
                description: 'The ID of the server to add premium to',
                type: 'STRING',
                required: true,
            },
            {
                name: 'period',
                description: 'The time period to use',
                type: 'STRING',
                choices: [{name: 'Hour', value: 'h'},{name: 'Day', value: 'd'},{name: 'Week', value: 'w'},{name: 'Month', value: 'm'},{name: 'Year', value: 'y'}],
                required: true,
            },
            {
                name: 'amount',
                description: 'The amount of x to give premium for',
                type: 'NUMBER',
                required: true
            },
        ]
    },
    {
        name: 'remove',
        description: 'Remove premium from a server',
        type: 'SUB_COMMAND',
        options: [
            {
                name: 'server-id',
                description: 'The ID of the server to remove premium from',
                type: 'STRING',
                required: true
            },
        ]
    },
],
cooldown: '',
requireRoles: false,
permissions: ['SEND_MESSAGES'],

callback: async({interaction, client}) => {
    const action = interaction.options.getSubcommand()

    if (action === 'add') {
        const serverId = interaction.options.getString('server-id')
        const type = interaction.options.getString('period')
        const amount = interaction.options.getNumber('amount')
        const result = await premuimGuildsSchema.findOne({guildId: serverId})
        if (result) {
            const errEmbed = new MessageEmbed()
            .setTitle('Could not add premium')
            .setColor('RED')
            .setDescription(`This server already has premium that expires <t:${Math.round(result.expires.getTime() / 1000)}:R>`)

            return interaction.reply({embeds: [errEmbed]})
        }

        const date = new Date()

        let time = amount

        if (type === 'h') time *= 60
        if (type === 'd') time *= 60 * 24
        if (type === 'w') time *= 60 * 24 * 7
        if (type === 'm') time *= 60 * 24 * 7 * 4
        if (type === 'y') time *= 60 * 24 * 7 * 4 * 12

        date.setMinutes(date.getMinutes() + time)

        await premuimGuildsSchema.create({
            guildId: serverId,
            expires: date
        })

        const addEmbed = new MessageEmbed()
        .setTitle('Premium guild added')
        .setDescription(`You have added guild \`${serverId}\` as a premium server. Premium expires <t:${Math.round(date.getTime() / 1000)}:R>`)
        .setColor('GREEN')

        try {
            const giftEmbed = new MessageEmbed()
            .setTitle('This server is now premium')
            .setDescription(`This server is now a premium server. Premium expires <t:${Math.round(date.getTime() / 1000)}:R>`)
            .setColor('GOLD')

            const server = client.guilds.cache.get(serverId)
            const channel = server.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(server.me).has('SEND_MESSAGES', 'EMBED_LINKS'))
            await channel.send({embeds: [giftEmbed]})
        } catch {}

        return interaction.reply({embeds: [addEmbed]})


    } else if (action === 'remove') {
        const serverId = interaction.options.getString('server-id')
        const result = await premuimGuildsSchema.findOne({guildId: serverId})
        if (!result) {
            const errEmbed = new MessageEmbed()
            .setTitle('Could not remove premium')
            .setColor('RED')
            .setDescription(`This server does not have premium`)

            return interaction.reply({embeds: [errEmbed]})
        }

        try {
            const leaveEmbed = new MessageEmbed()
            .setColor('RED')
            .setTitle('Your premium has run out!')
            .setDescription(`Your premium has run out for this server. To top it up please go the [support server](https://discord.gg/ArpuxMEa55)`)
            .setFooter({text: 'I have left the server'})

            const server = client.guilds.cache.get(serverId)
            const channel = server.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(server.me).has('SEND_MESSAGES', 'EMBED_LINKS'))
            await channel.send({embeds: [leaveEmbed]})
            server.leave()
        } catch {}
        const removeEmbed = new MessageEmbed()
        .setTitle('Removed a premium guild')
        .setDescription(`The guild \`${serverId}\` no longer has premium`)
        .setColor('RED')
        interaction.reply({embeds: [removeEmbed]})
        result.delete()
    }
}
}