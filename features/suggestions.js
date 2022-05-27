const maintenanceSchema = require('../models/mantenance-schema')
const blacklistSchema = require('../models/blacklist-schema')
const pollSchema = require('../models/suggestion-schema')
const { MessageEmbed } = require('discord.js')

module.exports = (client) => {
    client.on("interactionCreate", async (interaction, message) => {
        if (interaction.isButton()) {
            const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
                if (blacklist) {
                    return
                }

            const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance && interaction.user.id !== '804265795835265034') {
                interaction.reply ({content: `Maintenance mode is currently enabled. You are not able to run any commands or interact with the bot. | Reason: ${maintenance.maintenanceReason ? maintenance.maintenanceReason : 'No Reason Provided'}`, ephemeral: true,})
                return
            }

            const sendPoll = new MessageEmbed()
            .setTitle('Your vote has been counted!')
            .setColor('DARK_GREEN')

            const alreadyChosen = new MessageEmbed()
            .setTitle('You have already voted!')
            .setColor('DARK_RED')

            if (interaction.customId === '🟢') {
                const data = await pollSchema.findOne({ guildId: interaction.guild.id, messageId: interaction.message.id })
                if (!data) return;

                if (data.users.includes(interaction.user.id)) return interaction.reply({embeds: [alreadyChosen], ephemeral: true});

                const poll = await pollSchema.findOne({ guildId: interaction.guild.id, messageId: interaction.message.id })
                if(!poll) return

                poll.votes = poll.votes || {}

                if(poll.votes[interaction.customId]) poll.votes[interaction.customId] += 1
                else poll.votes[interaction.customId] = 1

                await pollSchema.findOneAndUpdate({ guildId: interaction.guild.id, messageId: interaction.message.id}, {button1: data.button1 + 1, $push: { users: interaction.user.id }, votes: poll.votes});

                interaction.reply({embeds: [sendPoll], ephemeral: true});
                const m = interaction.message
                m.edit({
                    components: m.components.map(row => {
                        row.components = row.components?.map(v => {
                            v.emoji == v.customId
                            v.label = `${poll.votes[v.customId] || 0}`;
                            return v;
                        });
                        return row;
                    })
                })
            } else if (interaction.customId === '🔴') {
                const data = await pollSchema.findOne({ guildId: interaction.guild.id, messageId: interaction.message.id })
                if (!data) return;

                if (data.users.includes(interaction.user.id)) return interaction.reply({embeds: [alreadyChosen], ephemeral: true});
                const poll = await pollSchema.findOne({ guildId: interaction.guild.id, messageId: interaction.message.id })
                if(!poll) return

                poll.votes = poll.votes || {}

                if(poll.votes[interaction.customId]) poll.votes[interaction.customId] += 1
                else poll.votes[interaction.customId] = 1

                await pollSchema.findOneAndUpdate({ guildId: interaction.guild.id, messageId: interaction.message.id}, {button1: data.button2 + 1, $push: { users: interaction.user.id }, votes: poll.votes});

                interaction.reply({embeds: [sendPoll], ephemeral: true});
                const m = interaction.message
                m.edit({
                    components: m.components.map(row => {
                        row.components = row.components?.map(v => {
                            v.emoji == v.customId
                            v.label = `${poll.votes[v.customId] || 0}`;
                            return v;
                        });
                        return row;
                    })
                })
            }
        }
    })}

    module.exports.config = {
        dbName: 'SUGGESTIONS',
        displayName: 'Suggestions'
    }