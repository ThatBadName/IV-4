const balanceSchema = require('../models/balance-schema')
const levelSchema = require('../models/leveling-schema')
const strikeSchema = require('../models/strike-schema')
const historySchema = require('../models/history-schema')
const {MessageActionRow, MessageButton} = require('discord.js')

module.exports = {
    name: 'thanos',
    description: 'Wipe a users everything',
    category: 'Dev',
    ownerOnly: true,
    slash: true,
    testOnly: true,
    options: [
        {
            name: 'userid',
            description: 'The user to wipe',
            type: 'STRING',
            required: true,
        },
    ],
    callback: async({interaction, channel}) => {

        const confirm = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel('WIPE').setStyle('DANGER').setCustomId('yes')
        )
        interaction.reply({content: `Are you sure (This will wipe EVERYTHING)`, components: [confirm]})

        const filter = (interaction) => {
            return interaction.user.id === interaction.user.id
        }
    
        const collector = channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 15000
        })
    
        collector.on('collect', (i) => {
            const userID = interaction.options.getString('userid')
            balanceSchema.collection.deleteMany({userId: userID})
            levelSchema.collection.deleteMany({userId: userID})
            historySchema.collection.deleteMany({userId: userID})
            strikeSchema.collection.deleteMany({userId: userID})


            i.reply({content: `<@${userID}> has been wiped`})
            })
    
            collector.on('end', async (collection) => {
                collection.forEach((click) => {
                })
    
                await interaction.editReply({
                    content: 'An action has already been taken',
                    components: [],
                })
            })
    }
}