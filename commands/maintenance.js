const { MessageEmbed } = require('discord.js')
const maintenanceSchema = require('../models/mantenance-schema')

module.exports = {
name: 'maintenance',
aliases: [''],
description: 'Put the bot into maintenance mode.',
category: 'Dev',
slash: true,
ownerOnly: true,
guildOnly: true,
testOnly: true,
options: [
    {
        name: 'toggle',
        description: 'Toggle maintenance mode on and off',
        type: 'STRING',
        choices: [
            {
                name: 'on',
                value: 'on'
            },
            {
                name: 'off',
                value: 'off'
            },
        ],
        required: true,
    },
    {
        name: 'reason',
        description: 'The reason for maintenance mode',
        type: 'STRING',
        required: false,
    },
],
cooldown: '',
requireRoles: false,

callback: async({interaction, client}) => {
    const doc = await maintenanceSchema.findOne()

    if (interaction.options.getString('toggle') === 'on') {
        maintenanceSchema.collection.deleteMany()
        maintenanceSchema.create({maintenance: true, maintenanceReason: interaction.options.getString('reason') || 'No Reason Provided'})

        client.user.setActivity('Maintenance Mode');
        client.user.setStatus('idle');

        const embedOn = new MessageEmbed()
        .setTitle('Maintenance Mode')
        .setColor('RED')
        .setDescription(`Maintenance Mode has been enabled. Only devs can run commands now | Reason: \`${interaction.options.getString('reason') || 'No Reason Provided'}\``)

        interaction.reply({embeds: [embedOn]})
    } else {
        maintenanceSchema.collection.deleteMany()

        await client.user.setActivity('');
        await client.user.setActivity(`Maintwnance Mode Off`, { type: 'PLAYING' })

        setTimeout(async () => {
            client.user.setActivity('');
            client.user.setStatus('online');
        }, 5000)

        const embedOff = new MessageEmbed()
        .setTitle('Maintenance Mode')
        .setColor('GREEN')
        .setDescription(`Maintenance Mode has been disabled.`)

        interaction.reply({embeds: [embedOff]})
    }
}
}