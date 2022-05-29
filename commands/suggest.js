const {
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js')
const suggestionSchema = require('../models/suggestion-schema')
const setupSchema = require('../models/setup-schema')

module.exports = {
    name: 'suggest',
    description: 'Suggest something',
    category: 'Fun',
    slash: true,
    options: [{
            name: 'suggest',
            description: 'Suggest something',
            type: 'SUB_COMMAND',
            options: [{
                    name: 'type',
                    description: 'Select the suggestion type',
                    required: true,
                    type: 'STRING',
                    choices: [{
                            name: 'Server',
                            value: 'Server suggestion',
                        },
                        {
                            name: 'Bot',
                            value: 'Bot suggestion',
                        },
                        {
                            name: 'Other',
                            value: 'Other suggestion',
                        },

                    ],
                },
                {
                    name: 'suggestion',
                    description: 'Your suggestion',
                    type: 'STRING',
                    required: true,
                },
            ]
        },
        {
            name: 'manage',
            description: 'Manage a suggestion',
            type: 'SUB_COMMAND',
            options: [{
                    name: "message_id",
                    description: "Provide the messageID of the suggestion",
                    type: "STRING",
                    required: true
                },
                {
                    name: 'type',
                    description: 'The type of action',
                    type: 'STRING',
                    required: true,
                    choices: [{
                            name: 'Approve',
                            value: '0'
                        },
                        {
                            name: 'Deny',
                            value: '1'
                        }
                    ],
                },
                {
                    name: 'reason',
                    description: 'The reason for your action',
                    type: 'STRING',
                    required: false
                }
            ],
        }
    ],

    callback: async ({
        interaction,
        guild
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

        if (interaction.options.getSubcommand() === 'suggest') {
            const result = await setupSchema.findOne({
                guildId: interaction.guild.id
            })
            if (!result) {
                setupSchema.create({
                    guildId: interaction.guild.id
                })
                return `No config data. Please run this command again`
            }

            const channel = guild.channels.cache.find(channel => channel.id === result.suggestionChannelId)
            if (!channel) return ('I could not find a suggestion channel. Please set one with `/config suggestion-channel <channel>`')

            const type = interaction.options.getString('type')
            const sug = interaction.options.getString('suggestion')

            const embed = new MessageEmbed()
                .setColor("WHITE")
                .setTitle(interaction.user.tag)
                .addField("Type", `${type}`)
                .addField("Suggestion", `${sug}`, true)

            const Row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId("🟢")
                    .setStyle("SECONDARY")
                    .setLabel('0')
                    .setEmoji("🟢"),
                    new MessageButton()
                    .setCustomId("🔴")
                    .setStyle("SECONDARY")
                    .setLabel('0')
                    .setEmoji("🔴"),
                )
            const message = await channel.send({
                embeds: [embed],
                components: [Row]
            });
            const thread = await message.startThread({
                name: `${interaction.user.tag}'s suggestion chat`,
                autoArchiveDuration: 60,
                reason: 'Automated Action',
            });
            thread.send(`Discuss this suggestion`)
            interaction.reply({
                custom: true,
                content: 'Sent your suggestion',
                ephemeral: true
            })

            suggestionSchema.create({
                guildId: interaction.guild.id,
                channelId: channel.id,
                messageId: message.id,
                title: sug,
                button1: 0,
                button2: 0
            })
        } else if (interaction.options.getSubcommand() === 'manage') {
            if(!interaction.member.permissions.has('MANAGE_MESSAGES')) return `You do not have permission to use this`
            const setup = await setupSchema.findOne({guildId: interaction.guild.id})
            const messageId = interaction.options.getString('message_id')
            const data = await suggestionSchema.findOne({messageId: messageId, guildId: interaction.guild.id})
            const msg = await interaction.guild.channels.cache.get(setup.suggestionChannelId).messages.fetch(messageId)
            const embed = msg.embeds[0]
            const reason = interaction.options.getString('reason') || 'No reason provided'

            const Embed = new MessageEmbed()
                if (!data) {
                    Embed
                        .setColor("RED")
                        .setTitle('Error')
                        .setDescription(`Could not find any suggestion with that messageID`);
                    return interaction.reply({embeds: [Embed], ephemeral: true});
                }

                if (interaction.options.getString('type') === '0') {
                    Embed
                        .setTitle(embed.title)
                        .setFields(embed.fields)
                        .setColor('GREEN')
                        .setDescription(`This suggestion has been approved:\n\`${reason.split(2000)}\``)
                    msg.edit({embeds: [Embed], components: []})
                    interaction.reply({content: 'Updated that suggestion', ephemeral: true})
                    data.delete()
                } else if (interaction.options.getString('type') === '1') {
                    Embed
                        .setTitle(embed.title)
                        .setFields(embed.fields)
                        .setColor('RED')
                        .setDescription(`This suggestion has been denied:\n\`${reason.split(2000)}\``)
                    msg.edit({embeds: [Embed], components: []})
                    interaction.reply({content: 'Updated that suggestion', ephemeral: true})
                    data.delete()
                }
        }

    }
}