const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'binary',
    description: 'Convert a number to and from binary',
    category: 'Fun',
    slash: true,
    options: [
        {
            name: 'function',
            description: 'the function to perform',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'binary-decimal',
                    value: '0'
                },
                {
                    name: 'decimal-binary',
                    value: '2',
                },
            ],
        },
        {
            name: 'number',
            description: 'The number to convert',
            type: 'NUMBER',
            required: true,
        },
    ],
    callback: async({interaction}) => {
        const blacklistSchema = require('../models/blacklist-schema')
        const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
        if (blacklist) {
            return
        }
        const maintenanceSchema = require('../models/mantenance-schema')
        const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance && interaction.user.id !== '804265795835265034') {
                return
            } else {
        
        var num = interaction.options.getNumber('number')
        const number = interaction.options.getNumber('number')
        if (interaction.options.getString('function') === '0') {
            const dec = parseInt(number, 2)
            const embed = new MessageEmbed()
           .setTitle('Binary → Decimal')
           .addField('As Decimal', `\`${dec}\``)
           .addField('As Binary', `\`${number}\``)
           .setColor('RANDOM')
           return embed

        } else {
           var num = num.toString(2)
           const embed = new MessageEmbed()
           .setTitle('Decimal → Binary')
           .addField('As Decimal', `\`${number}\``)
           .addField('As Binary', `\`${num}\``)
           .setColor('RANDOM')
           return embed
        }
    }
    }
}