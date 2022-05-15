const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    category: 'Moderation',
    description: 'Deletes multiple messages at once',
    options: [
        {
            name: 'amount',
            description: 'Amount of messages to delete',
            required: true,
            type: 'INTEGER',
        },
        {
            name: 'silent',
            description: 'Whether to make the action silent or not',
            required: true,
            type: 'BOOLEAN'
        },
        {
            name: 'target',
            description: 'The target to delete',
            required: false,
            type: 'USER',
        },
    ],

    permissions: ['MANAGE_MESSAGES'],

    slash: true,
    guildOnly: true,

    /**
     * @param {CommandInteraction} interaction
     */

    callback: async ({ interaction, options, channel }) => {
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
        const amount = options.getInteger('amount')
        const target = options.getMember('target')
        const messages = await channel.messages.fetch()
        const embed = new MessageEmbed()
            .setColor("FUCHSIA")

        if (target) {
            let i = 0
            const filtered = [];
            (await messages).filter((m) => {
                if (m.author.id === target.id && amount > i) {
                    filtered.push(m)
                    i++
                }
            })

            await channel.bulkDelete(filtered, true).then (messages => {
                embed.setDescription(`Purged \`${messages.size}\` messages from ${target}`)
                if (interaction.options.getBoolean('silent') === false) {
                    interaction.channel.send({embeds: [embed]}).then(msg => {setTimeout(() => msg.delete(), 5000)})
                }
                interaction.reply({embeds: [embed], ephemeral: true})
            })
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                embed.setDescription(`Purged \`${messages.size}\` messages`)
                if (interaction.options.getBoolean('silent') === false) {
                    interaction.channel.send({embeds: [embed]}).then(msg => {setTimeout(() => msg.delete(), 5000)})
                }
                interaction.reply({embeds: [embed], ephemeral: true})
            })
        }
    }
}