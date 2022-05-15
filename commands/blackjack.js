const blackjack = require('discord-blackjack')
const {
    MessageEmbed
} = require('discord.js')
const balanceSchema = require('../models/balance-schema')

module.exports = {
    name: 'blackjack',
    description: 'Play a game of blackjack',
    category: 'Fun',
    slash: true,
    cooldown: '20s',
    options: [{
        name: 'bet',
        description: 'The amount to bet',
        type: 'NUMBER',
        required: true,
    }, ],

    callback: async ({
        interaction
    }) => {
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
        
        let multi = 1
        const bet = interaction.options.getNumber('bet')
        if (bet < 1000) return `You can't bet under φ\`1000\``
        if (bet > 50000) return `You can only bet up to φ\`50000\``
        if (bet >= 5000) multi = 2
        if (bet >= 10000) multi = 3
        if (bet >= 25000) multi = 4
        if (bet >= 40000) multi = 5

        const check = await balanceSchema.findOne({
            guildId: interaction.guild.id,
            userId: interaction.user.id
        })
        if (!check) {
            balanceSchema.create({
                guildId: interaction.guild.id,
                userId: interaction.user.id,
                amount: 0
            })
            return `You do not have enough money to do this`
        }
        if (check.amount < bet) return `You do not have enough money to do this`

        let embedGame = {
            title: `${interaction.user.username}'s blackjack`,
            color: "RANDOM",
            fields: [{
                    name: `${interaction.user.username}'s hand`,
                    value: ""
                },
                {
                    name: `Dealer's Hand`,
                    value: ""
                }
            ],

        }
        let game = await blackjack(interaction, {
            normalEmbed: false,
            normalEmbedContent: embedGame,
            resultEmbed: false,
        })

        if (game.result === "CANCEL") {
            const embedCancel = new MessageEmbed()
            .setTitle('Game Canceled')
            .setDescription(`You canceled the game. The dealer wants none of that so took your money anyway\n\nYou lost φ\`${bet}\``)
            .setFooter({text: 'lol'})
            .setColor('BLURPLE')
            interaction.channel.send({embeds: [embedCancel]}).then(msg => {setTimeout(() => msg.delete(), 15000)})

            const docCancel = await balanceSchema.findOne({
                guildId: interaction.guild.id,
                userId: interaction.user.id
            })
            if (!docCancel) {
                balanceSchema.create({
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    amount: 0
                })
            } else {
                docCancel.amount -= bet
                docCancel.save()
            }
        }

        if (game.result === "TIMEOUT") {
            const embedCancel = new MessageEmbed()
            .setTitle('Game Canceled')
            .setDescription(`You were idle for too long. The dealer wants none of that so took your money anyway\n\nYou lost φ\`${bet}\``)
            .setFooter({text: 'lol'})
            .setColor('BLURPLE')
            interaction.channel.send({embeds: [embedCancel]}).then(msg => {setTimeout(() => msg.delete(), 15000)})

            const docCancel = await balanceSchema.findOne({
                guildId: interaction.guild.id,
                userId: interaction.user.id
            })
            if (!docCancel) {
                balanceSchema.create({
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    amount: 0
                })
            } else {
                docCancel.amount -= bet
                docCancel.save()
            }
        }

            if (game.result === "WIN") {
                const winning = Math.floor(Math.random()*bet*multi)

                const docWin = await balanceSchema.findOne({
                    guildId: interaction.guild.id,
                    userId: interaction.user.id
                })
                if (!docWin) {
                    balanceSchema.create({
                        guildId: interaction.guild.id,
                        userId: interaction.user.id,
                        amount: winning
                    })
                } else {
                    docWin.amount += winning
                    docWin.save()
                }


                const embedWin = new MessageEmbed()
                    .setTitle('You won')
                    .setDescription(`${game.method === 'Dealer busted' ? 'The dealer went bust' : game.method === 'You had blackjack' ? 'You got to 21 first' : game.method === 'You had more' ? 'You had more than the dealer' : 'None'}\n\nYou won φ\`${winning}\``)
                    .setColor('GREEN')
                    .setFooter({text: `${multi > 1 ? `Multi: ${multi}` : ''}`})
                interaction.channel.send({
                    embeds: [embedWin]
                }).then(msg => {setTimeout(() => msg.delete(), 15000)})
            }
            if (game.result === "LOSE") {
                const docLose = await balanceSchema.findOne({
                    guildId: interaction.guild.id,
                    userId: interaction.user.id
                })
                if (!docLose) {
                    balanceSchema.create({
                        guildId: interaction.guild.id,
                        userId: interaction.user.id,
                        amount: 0
                    })
                } else {
                    docLose.amount -= bet
                    docLose.save()
                }


                const embedLose = new MessageEmbed()
                    .setTitle('You lost')
                    .setDescription(`${game.method === 'You busted' ? 'You went bust lol' : game.method === 'Dealer had blackjack' ? 'The dealer got to 21 first' : game.method === 'Dealer had more' ? 'The dealer had more than you' : 'None'}\n\nYou lost φ\`${bet}\``)
                    .setColor('RED')
                interaction.channel.send({
                    embeds: [embedLose]
                }).then(msg => {setTimeout(() => msg.delete(), 15000)})
            }

            if (game.result === "TIE") {
                const embedTie = new MessageEmbed()
                .setTitle('Tie')
                .setDescription(`${game.method === 'Tie' ? 'The game ended in a draw. You can both keep your money' : 'None'}`)
                .setFooter({text: `What a shame`})
                .setColor('ORANGE')
                interaction.channel.send({embeds: [embedTie]}).then(msg => {setTimeout(() => msg.delete(), 15000)})
            }
        }
}
}