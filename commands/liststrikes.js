const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const path = require('path');
const strikeSchema = require(path.join(__dirname, '../models/strike-schema'));

module.exports = {
    name: 'liststrikes',
    category: 'Moderation',
    description: 'View your strikes',
    cooldown: '15s',
    slash: true,
    guildOnly: true,

    callback: async ({
        guild,
        member: staff,
        interaction,
        user
    }) => {
        const blacklistSchema = require('../models/blacklist-schema')
        const blacklist = await blacklistSchema.findOne({
            userId: interaction.user.id
        })
        if (blacklist) {
            return
        }
        const maintenanceSchema = require('../models/mantenance-schema')
        const maintenance = await maintenanceSchema.findOne({
            maintenance: true
        })
        if (maintenance && interaction.user.id !== '804265795835265034') {

            return
        }

        if (!guild) {
            return ('This command can only be run in a server')
        }

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Please check your DMs')
                .setColor('0xff3d15')
            ],
            components: []
        })
        const pageButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('firstPage')
                .setEmoji('⏪')
                .setDisabled(true)
                .setStyle('SECONDARY'),

                new MessageButton()
                .setCustomId('backPage')
                .setEmoji('◀️')
                .setDisabled(true)
                .setStyle('SECONDARY'),

                new MessageButton()
                .setCustomId('nextPage')
                .setEmoji('▶️')
                .setStyle('SECONDARY'),

                new MessageButton()
                .setCustomId('lastPage')
                .setEmoji('⏩')
                .setStyle('SECONDARY'),
            )

        let currentPage = 0
        const findStrikes = await strikeSchema.find({
            userId: interaction.user.id,
            guildId: interaction.guild.id,

        })

        const strikeEmbeds = generatePagesStrikes(findStrikes)
        const messageSendStart = await interaction.member.send({
            embeds: [strikeEmbeds[0]],
            content: `Current Page: \`${currentPage + 1}/${strikeEmbeds.length}\``,
            components: [pageButtons]
        }).catch(() => {
            return interaction.member.send({
                embeds: [new MessageEmbed().setColor(0xff0000).setTitle('You do not have any active strikes')]
            })
        })
        const pageButtonCollector = await messageSendStart.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 30000
        })

        pageButtonCollector.on('collect', async (i) => {
            if (i.customId === 'backPage') {
                if (currentPage !== 0) {
                    --currentPage
                    if (currentPage === 0) {
                        pageButtons.components[2].setDisabled(false)
                        pageButtons.components[3].setDisabled(false)
                        pageButtons.components[0].setDisabled(true)
                        pageButtons.components[1].setDisabled(true)
                    } else {
                        pageButtons.components[2].setDisabled(false)
                        pageButtons.components[3].setDisabled(false)
                        pageButtons.components[0].setDisabled(false)
                        pageButtons.components[1].setDisabled(false)
                    }
                    messageSendStart.edit({
                        content: `Current Page: \`${currentPage + 1}/${strikeEmbeds.length}\``,
                        embeds: [strikeEmbeds[currentPage]],
                        components: [pageButtons]
                    })
                    i.deferUpdate()
                    pageButtonCollector.resetTimer()
                } else i.reply({
                    content: `There are no more pages`,
                    ephemeral: true,
                })
            } else if (i.customId === 'nextPage') {
                if (currentPage + 1 !== strikeEmbeds.length) {
                    currentPage++
                    if (currentPage + 1 === strikeEmbeds.length) {
                        pageButtons.components[0].setDisabled(false)
                        pageButtons.components[1].setDisabled(false)
                        pageButtons.components[2].setDisabled(true)
                        pageButtons.components[3].setDisabled(true)
                    } else {
                        pageButtons.components[2].setDisabled(false)
                        pageButtons.components[3].setDisabled(false)
                        pageButtons.components[0].setDisabled(false)
                        pageButtons.components[1].setDisabled(false)
                    }
                    messageSendStart.edit({
                        content: `Current Page: \`${currentPage + 1}/${strikeEmbeds.length}\``,
                        embeds: [strikeEmbeds[currentPage]],
                        components: [pageButtons]
                    })
                    i.deferUpdate()
                    pageButtonCollector.resetTimer()
                } else i.reply({
                    content: `There are no more pages`,
                    ephemeral: true,
                })
            } else if (i.customId === 'lastPage') {
                if (currentPage + 1 !== strikeEmbeds.length) {
                    currentPage = strikeEmbeds.length - 1
                    if (currentPage + 1 === strikeEmbeds.length) {
                        pageButtons.components[0].setDisabled(false)
                        pageButtons.components[1].setDisabled(false)
                        pageButtons.components[2].setDisabled(true)
                        pageButtons.components[3].setDisabled(true)
                    } else {
                        pageButtons.components[2].setDisabled(false)
                        pageButtons.components[3].setDisabled(false)
                        pageButtons.components[0].setDisabled(false)
                        pageButtons.components[1].setDisabled(false)
                    }
                    messageSendStart.edit({
                        content: `Current Page: \`${currentPage + 1}/${strikeEmbeds.length}\``,
                        embeds: [strikeEmbeds[currentPage]],
                        components: [pageButtons]
                    })
                    i.deferUpdate()
                    pageButtonCollector.resetTimer()
                } else i.reply({
                    content: `There are no more pages`,
                    ephemeral: true,
                })
            } else if (i.customId === 'firstPage') { //!
                if (currentPage !== 0) {
                    currentPage = 0
                    if (currentPage === 0) {
                        pageButtons.components[2].setDisabled(false)
                        pageButtons.components[3].setDisabled(false)
                        pageButtons.components[0].setDisabled(true)
                        pageButtons.components[1].setDisabled(true)
                    } else {
                        pageButtons.components[2].setDisabled(false)
                        pageButtons.components[3].setDisabled(false)
                        pageButtons.components[0].setDisabled(false)
                        pageButtons.components[1].setDisabled(false)
                    }
                    messageSendStart.edit({
                        content: `Current Page: \`${currentPage + 1}/${strikeEmbeds.length}\``,
                        embeds: [strikeEmbeds[currentPage]],
                        components: [pageButtons]
                    })
                    i.deferUpdate()
                    pageButtonCollector.resetTimer()
                } else i.reply({
                    content: `There are no more pages`,
                    ephemeral: true,
                })
            }
        })
        pageButtonCollector.on('end', i => {
            messageSendStart.edit({content: `Panel timed out`, components: []})
        })

        function generatePagesStrikes(strikes) {
            const strikeEmbeds = []
            let k = 5
            for (let i = 0; i < strikes.length; i += 5) {
                const current = strikes.slice(i, k)
                let j = i
                k += 5
                let info = `No Strikes Logged`
                info = current.map(strike => `**ID**: \`${strike._id}\`\n**Date**: <t:${Math.round(strike.createdAt.getTime() / 1000)}>\n**Reason**: ${strike.reason}`).join('\n\n')
                const embed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('Strike List')
                    .setDescription(info)
                strikeEmbeds.push(embed)
            }
            return strikeEmbeds

        }
    }
}