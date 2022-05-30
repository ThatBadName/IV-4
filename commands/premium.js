const { MessageEmbed } = require('discord.js')
const premuimGuildsSchema = require('../models/premiumGuild-schema')
const premiumCodeSchema = require('../models/premiumCode-schema')
const moment = require('moment')
const voucher_codes = require('voucher-code-generator')

module.exports = {
name: 'premium',
aliases: [''],
description: 'Manage a servers premium status.',
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
    {
        name: 'gen-code',
        description: 'Generate a code for users to redeem',
        type: 'SUB_COMMAND',
        options: [
            {
                name: 'plan',
                description: 'The plan to use',
                type: 'STRING',
                required: true,
                choices: [
                    {
                      name: "daily",
                      value: "daily",
                    },
                    {
                      name: "weekly",
                      value: "weekly",
                    },
                    {
                      name: "monthly",
                      value: "monthly",
                    },
                    {
                      name: "yearly",
                      value: "yearly",
                    },
                  ],
            },
            {
                name: 'amount',
                description: 'The amount of codes to create',
                type: "NUMBER",
                required: false,
            },
        ],
    },
    {
        name: 'delete-code',
        description: 'Delete a code',
        type: 'SUB_COMMAND',
        options: [
            {
                name: 'code',
                description: 'The code to delete',
                type: 'STRING',
                required: true
            }
        ],
    },
    {
        name: 'list-codes',
        description: 'List all the active codes',
        type: 'SUB_COMMAND'
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
            if (interaction.options.getString('leave') === '0') {
                server.leave()
            }
        } catch {}
        const removeEmbed = new MessageEmbed()
        .setTitle('Removed a premium guild')
        .setDescription(`The guild \`${serverId}\` no longer has premium`)
        .setColor('RED')
        interaction.reply({embeds: [removeEmbed]})
        result.delete()
    } else if (interaction.options.getSubcommand() === 'gen-code') {
        let codes = []

        const plan = interaction.options.getString('plan')

        let amount = interaction.options.getNumber("amount");
        if (!amount) amount = 1;

        for (var i = 0; i < amount; i++) {
        const codePremium = voucher_codes.generate({
            pattern: "####-####-####",
        });

        const code = codePremium.toString().toUpperCase();

        const find = await premiumCodeSchema.findOne({
            code: code,
        });

        if (!find) {
            premiumCodeSchema.create({
            code: code,
            plan: plan,
            });

            codes.push(`${i + 1}- ${code}`);
        }
        }

        return await interaction.reply({
        content: `\`\`\`Generated +${codes.length}\n\n--------\n${codes.join(
            "\n"
        )}\n--------\n\nType - ${plan}\n\`\`\`\nTo redeem, use \`/redeem <code>\``, ephemeral: true
        });
    } else if (interaction.options.getSubcommand() === 'list-codes') {
        const results = await premiumCodeSchema.find().limit(50)
        let text = ''

        for (let counter = 0; counter < results.length; ++counter) {
            const { code, plan } = results[counter]

            text += `**#${counter + 1}** \`${code}\` - \`${plan}\`\n`
        }
        const listEmbed = new MessageEmbed()
        .setTitle('Active codes')
        .setDescription(text)
        .setColor('0xFF3D15')

        interaction.reply({embeds: [listEmbed]})
    } else if (interaction.options.getSubcommand() === 'delete-code') {
        let code = interaction.options.getString('code')
        const result = await premiumCodeSchema.findOne({code: code.toUpperCase()})

        const invalidCodeEmbed = new MessageEmbed()
        .setTitle('Invalid code')
        .setDescription(`\`${code.toUpperCase()}\` is not a valid code`)
        .setColor('RED')

        if (!result) return interaction.reply({embeds: [invalidCodeEmbed]})

        const deletedCodeEmbed = new MessageEmbed()
        .setTitle('Deleted a code')
        .setDescription(`I have deleted the code \`${code.toUpperCase()}\``)
        .setColor('GOLD')

        interaction.reply({embeds: [deletedCodeEmbed]})
        result.delete()
    }
}
}