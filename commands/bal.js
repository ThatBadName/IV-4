const { MessageEmbed, InteractionWebhook } = require('discord.js')
const balanceSchema = require('../models/balance-schema')
const levelSchema = require('../models/leveling-schema')

module.exports = {
    name: 'balance',
    description: 'View balances, the leaderboard and transfer money.',
    category: 'Economy',
    slash: true,
    cooldown: '3s',
    guildOnly: true,
    options: [
        {
            name: 'view',
            description: 'View the balance of you or someone else',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The user to view',
                    type: 'USER',
                    required: false,
                },
            ],
        },
        {
            name: 'transfer',
            description: 'Give some of your money to another user',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The user to transfer money to',
                    type: 'USER',
                    required: 'true',
                },
                {
                    name: 'amount',
                    description: 'The amount to transfer',
                    type: 'NUMBER',
                    required: true,
                },
                {
                    name: 'message',
                    description: 'The message to send with the money',
                    type: 'STRING',
                    required: false,
                },
            ],
        },
        {
            name: 'leaderboard',
            description: 'Get the top 15 richest users',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'type',
                    description: 'Choose how to rank the leaderboard',
                    type: 'STRING',
                    required: true,
                    choices: [
                        {
                            name: 'wallet',
                            value: 'wallet'
                        },
                        {
                            name: 'bank',
                            value: 'bank'
                        },
                        {
                            name: 'net',
                            value: 'net'
                        },
                    ],
                },
            ],
        },
        {
            name: 'fix',
            description: 'If you are getting errors purchacing items/transfering money run this',
            type: 'SUB_COMMAND',
        },
        {
            name: 'move',
            description: 'Move your coins in and out of your bank',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'where',
                    description: 'Where to move your coins to',
                    type: 'STRING',
                    required: true,
                    choices: [
                        {
                            name: 'bank',
                            value: 'bank',
                        },
                        {
                            name: 'wallet',
                            value: 'wallet',
                        },
                    ],
                },
                {
                    name: 'amount',
                    description: 'The amount to move (put 0 to move all)',
                    type: 'NUMBER',
                    required: true,
                },
            ],
        },
    ],

    callback: async ({interaction, Client}) => {
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

        if (interaction.options.getSubcommand() === 'view') {
            if (interaction.options.getUser('user')) {
                
                const user = interaction.options.getUser('user')
    
                const userBal = balanceSchema.findOne({userId: user.id}, async(err, bal)=>{
                    if(!bal) {
                    return `I could not find the user in my database`
                    }
                    
                    });
                    const walletBal = await balanceSchema.findOne({
                        userId: user.id,
                        guildId: interaction.guild.id,
                    })
    
                if (!walletBal) {
                    const balEmbed = new MessageEmbed()
                    .setTitle(`${user.username}'s balance`)
                    .setDescription(`${user.tag} does not have a balance. Send some messages to get one`)
                    .setColor('RANDOM')
                    return balEmbed
                } else {
                    const level = await levelSchema.findOne({guildId: interaction.guild.id, userId: user.id})
                    const bankSpace = level.level * 750
                    const balEmbed = new MessageEmbed()
                    .setTitle(`${user.username}'s balance`)
                    .setDescription(`**Wallet:** φ\`${walletBal.amount}\`\n**Bank:** φ\`${walletBal.bankAmount}/${level.level * 750}\` (${Math.round(walletBal.bankAmount / bankSpace * 100) || 0}% full)`)
                    .setColor('RANDOM')
                    return balEmbed
                }
            } else {
                const user = interaction.user
    
                const userBal = balanceSchema.findOne({userId: user.id}, async(err, bal)=>{
                    if(!bal) {
                    return `I could not find the user in my database`
                    }
                    
                    });
                    const walletBal = await balanceSchema.findOne({
                        userId: user.id,
                        guildId: interaction.guild.id,
                    })
    
                if (!walletBal) {
                    const balEmbed = new MessageEmbed()
                    .setTitle(`${user.username}'s balance`)
                    .setDescription(`${user.tag} does not have a balance. Send some messages to get one`)
                    .setColor('RANDOM')
                    return balEmbed
                } else {
                    const level = await levelSchema.findOne({guildId: interaction.guild.id, userId: user.id})
                    const bankSpace = level.level * 750
                    const balEmbed = new MessageEmbed()
                    .setTitle(`${user.username}'s balance`)
                    .setDescription(`**Wallet:** φ\`${walletBal.amount}\`\n**Bank:** φ\`${walletBal.bankAmount}/${level.level * 750}\` (${Math.round(walletBal.bankAmount / bankSpace * 100) || 0}% full)`)
                    .setColor('RANDOM')
                    return balEmbed
                }
            }
        } else if (interaction.options.getSubcommand() === 'transfer') {
            const recipient = interaction.options.getUser('user')
            const sender = interaction.user
            const amount = interaction.options.getNumber('amount')
            const message = interaction.options.getString('message')

            var walletBalSender = await balanceSchema.findOne({
                userId: sender.id,
                guildId: interaction.guild.id,
            })
            var walletBalReciever = await balanceSchema.findOne({
                userId: recipient.id,
                guildId: interaction.guild.id,
            })
            if (!walletBalReciever) {
                await balanceSchema.create({
                guildId: interaction.guild.id,
                userId: recipient.id,
                amount: 0,
                bankAmount: 0
                    })
            }


            if (amount === 0) {
                return `What is the point in sending nothing`
            }
            if (amount < 0) {
                return `Your a cheeky one aren't you. I might take some of your money away for that...`
            }
            if (!walletBalSender) {
                return `Hmm, I couldn't find you in my database. Try sending a message or doing \`/balance register\``
            }
            if (walletBalSender.amount < amount) {
                return `${sender}, you do not have enough money to do this. You have φ\`${walletBalSender.amount}\` and you want to send φ\`${amount}\`)`
            }
            if (sender === recipient) {
                return `${sender}, you can't send money to yourself`
            }

            const dataSend = await balanceSchema.findOne({
                userId: sender.id
            });
                dataSend.amount -= amount;
                dataSend.save();
            
                const dataRecieve = await balanceSchema.findOne({
                    guildId: interaction.guild.id,
                    userId: recipient.id
                });
                    dataRecieve.amount += amount;
                    dataRecieve.save();

                const sendMoneyEmbed = new MessageEmbed()
                .setTitle('Money Transfer')
                .setDescription(`You sent φ\`${amount}\` to ${recipient}. They now have φ\`${walletBalReciever.amount + amount}\` and you have φ\`${walletBalSender.amount - amount}\``)
                .addField('Message:', `${message || 'None'}`)
                .setColor('RANDOM')

                const sendMoneyEmbedUser = new MessageEmbed()
                .setTitle('You have been gifted')
                .setFields(
                    {
                        name: 'Amount',
                        value: `φ\`${amount}\``,
                        inline: true,
                    }, {
                        name: 'Sender',
                        value: `${sender}`,
                        inline: true,
                    }, {
                        name: 'New Balance',
                        value: `φ\`${walletBalReciever.amount + amount}\``,
                        inline: true,
                    }, {
                        name: 'Message',
                        value: `${message || 'None'}`,
                        inline: true,
                    },
                )
                .setColor('RANDOM')

                try {
                    recipient.send({embeds: [sendMoneyEmbedUser]})
                } catch (err) {
                    console.log(err)
                }

                return sendMoneyEmbed
                
            
        } else if (interaction.options.getSubcommand() === 'leaderboard') {
                if(interaction.options.getString('type') === 'wallet') {
                    let text = ''
                const results = await balanceSchema.find({
                    guildId: interaction.guild.id,

                }).sort({
                    amount: -1
                }).limit(15)

                for (let counter = 0; counter < results.length; ++counter) {
                    const { userId, amount = 0 } = results[counter]

                    text += `**#${counter + 1}** <@${userId}> - φ\`${amount}\`\n`
                }
                const lbEmbed = new MessageEmbed()
                .setTitle('Balance Leaderboard')
                .setColor('RANDOM')
                .setFooter({text: 'This is calculated off of wallets only'})
                .setDescription(text)
                return lbEmbed
                } else if (interaction.options.getString('type') === 'bank') {
                    let text = ''
                const results = await balanceSchema.find({
                    guildId: interaction.guild.id,

                }).sort({
                    bankAmount: -1
                }).limit(15)

                for (let counter = 0; counter < results.length; ++counter) {
                    const { userId, bankAmount = 0 } = results[counter]

                    text += `**#${counter + 1}** <@${userId}> - φ\`${bankAmount}\`\n`
                }
                const lbEmbed = new MessageEmbed()
                .setTitle('Balance Leaderboard')
                .setColor('RANDOM')
                .setFooter({text: 'This is calculated off of banks only'})
                .setDescription(text)
                return lbEmbed
                } else {
                    let text = ''
                    const results = await balanceSchema.find({
                        guildId: interaction.guild.id,
    
                    }).sort({
                        bankAmount: -1,
                        amount: -1
                    }).limit(15)
    
                    for (let counter = 0; counter < results.length; ++counter) {
                        const { userId, bankAmount = 0, amount = 0 } = results[counter]
    
                        text += `**#${counter + 1}** <@${userId}> - φ\`${bankAmount + amount}\`\n`
                    }
                    const lbEmbed = new MessageEmbed()
                    .setTitle('Net Worth Leaderboard')
                    .setColor('RANDOM')
                    .setFooter({text: 'This is calculated off of banks and wallets'})
                    .setDescription(text)
                    return lbEmbed
                }
        } else if (interaction.options.getSubcommand() === 'fix') {
            const result = await balanceSchema.findOne({
                guildId: interaction.guild.id,
                userId: interaction.user.id
            })
            if (!result) {
                balanceSchema.create({
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    amount: 0,
                    bankAmount: 0
                })
                return `Fixed!`
            } else {
                return `There is nothing wrong`
            }
        } else if (interaction.options.getSubcommand() === 'move') {
            const level = await levelSchema.findOne({guildId: interaction.guild.id, userId: interaction.user.id})
            const bankSpace = level.level * 750
            var amount = interaction.options.getNumber('amount')
            const data = await balanceSchema.findOne({guildId: interaction.guild.id, userId: interaction.user.id})

            if (interaction.options.getString('where') === 'bank') {
                if (amount > data.amount) return `You can't move more money than what you have`
                if (data.amount <= 0) return `You don't have any money in your wallet`
                if (amount < 0) return `You can't move less than 0 coins`
                if (data.bankAmount + amount > level.level * 750) return `You can only have φ\`${level.level * 750}\` coins in your bank`

                if (amount === 0) {
                    var amountMove = bankSpace - data.bankAmount
                    if (amountMove >= data.amount) {

                        amountMove = data.amount
                    }
                } else {
                    amountMove = amount
                }

                data.amount -= amountMove
                data.bankAmount += amountMove
                data.save()
                const embed = new MessageEmbed()
                .setTitle('Money Move From Wallet To Bank')
                .addField('Wallet', `φ\`${data.amount}\``, true)
                .addField('Bank', `φ\`${data.bankAmount}/${level.level * 750}\` (${Math.round(data.bankAmount / bankSpace * 100) || 0}% full)`, true)
                .addField('Amount Moved', `φ\`${amountMove}\``)
                .setColor('RANDOM')
                return embed

            } else {
                if (amount < 0) return `You can't move less than 0 coins`
                if (data.bankAmount <= 0) return `You dont have any money in your bank`
                if (amount > data.bankAmount) return `You can't move more money than what you have`

                if (amount === 0) {
                    var amount = data.bankAmount
                }

                data.amount += amount
                data.bankAmount -= amount
                data.save()
                const embed = new MessageEmbed()
                .setTitle('Money Move From Bank To Wallet')
                .addField('Wallet', `φ\`${data.amount}\``, true)
                .addField('Bank', `φ\`${data.bankAmount}/${level.level * 750}\` (${Math.round(data.bankAmount / bankSpace * 100) || 0}% full)`, true)
                .addField('Amount Moved', `φ\`${amount}\``)
                .setColor('RANDOM')
                return embed
            }
        }
    }
}
}