const maintenanceSchema = require('../models/mantenance-schema')
const blacklistSchema = require('../models/blacklist-schema')
const pollSchema = require('../models/poll-schema')

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

            if (interaction.customId === 'poll-1') {
                const data = await pollSchema.findOne({ GuildID: interaction.guild.id, MessageID: interaction.message.id })
                if (!data) return;

                if (data.Users.includes(interaction.user.id)) return interaction.reply({content: `You have already chosen your answer`, ephemeral: true});

                await pollSchema.findOneAndUpdate({ GuildID: interaction.guild.id, MessageID: interaction.message.id}, {Button1: data.Button1 + 1, $push: { Users: interaction.user.id }});

                interaction.reply({content: `Your answer has been sent`, ephemeral: true});
            } else if (interaction.customId === 'poll-2') {
                const data = await pollSchema.findOne({ GuildID: interaction.guild.id, MessageID: interaction.message.id })
                if (!data) return;

                if (data.Users.includes(interaction.user.id)) return interaction.reply({content: `You have already chosen your answer`, ephemeral: true});

                await pollSchema.findOneAndUpdate({ GuildID: interaction.guild.id, MessageID: interaction.message.id}, {Button2: data.Button2 + 1, $push: { Users: interaction.user.id }});

                interaction.reply({content: `Your answer has been sent`, ephemeral: true});
            } else if (interaction.customId === 'poll-3') {
                const data = await pollSchema.findOne({ GuildID: interaction.guild.id, MessageID: interaction.message.id })
                if (!data) return;

                if (data.Users.includes(interaction.user.id)) return interaction.reply({content: `You have already chosen your answer`, ephemeral: true});

                await pollSchema.findOneAndUpdate({ GuildID: interaction.guild.id, MessageID: interaction.message.id}, {Button3: data.Button3 + 1, $push: { Users: interaction.user.id }});

                interaction.reply({content: `Your answer has been sent`, ephemeral: true});
            } else if (interaction.customId === 'poll-4') {
                const data = await pollSchema.findOne({ GuildID: interaction.guild.id, MessageID: interaction.message.id })
                if (!data) return;

                if (data.Users.includes(interaction.user.id)) return interaction.reply({content: `You have already chosen your answer`, ephemeral: true});

                await pollSchema.findOneAndUpdate({ GuildID: interaction.guild.id, MessageID: interaction.message.id}, {Button4: data.Button4 + 1, $push: { Users: interaction.user.id }});

                interaction.reply({content: `Your answer has been sent`, ephemeral: true});
            } else if (interaction.customId === 'poll-5') {
                const data = await pollSchema.findOne({ GuildID: interaction.guild.id, MessageID: interaction.message.id })
                if (!data) return;

                if (data.Users.includes(interaction.user.id)) return interaction.reply({content: `You have already chosen your answer`, ephemeral: true});

                await pollSchema.findOneAndUpdate({ GuildID: interaction.guild.id, MessageID: interaction.message.id}, {Button5: data.Button5 + 1, $push: { Users: interaction.user.id }});

                interaction.reply({content: `Your answer has been sent`, ephemeral: true});
            }
        }
        })
}

module.exports.config = {
    dbName: 'POLL',
    displayName: 'Polls'
}