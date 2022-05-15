const {
    MessageEmbed
} = require('discord.js')
const balanceSchema = require('../models/balance-schema')

module.exports = {
    name: 'coins',
    description: 'Manage a users coins.',
    category: 'Economy',
    slash: true,
    ownerOnly: true,
    options: [{
            name: 'action',
            description: 'The action to perform',
            type: 'STRING',
            required: true,
            choices: [{
                    name: 'add',
                    value: 'add'
                },
                {
                    name: 'set',
                    value: 'set',
                },
            ],
        },
        {
            name: 'where',
            description: 'Where to put the coins',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'bank',
                    value: 'bank'
                },
                {
                    name: 'wallet',
                    value: 'wallet',
                },
            ],
        },
        {
            name: 'user',
            description: 'The user to manage',
            type: 'USER',
            required: true,
        },
        {
            name: 'amount',
            description: 'The number of coins',
            type: 'NUMBER',
            required: true,
        },

    ],

    callback: async ({
        interaction
    }) => {
        const blacklistSchema = require('../models/blacklist-schema')
        const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
        if (blacklist) {
            return
        }
        
        const user = interaction.options.getUser('user');
        let amountAdd = interaction.options.getNumber('amount')

        if (interaction.options.getString('where') === 'wallet') {
            if (interaction.options.getString('action') === 'add') {

                const data = await  balanceSchema.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id
                });
                
                let walletBalOg;
                
                    if (!data) {
                        const newData = await balanceSchema.create({
                            guildId: interaction.guild.id,
                            userId: user.id,
                            amount: amountAdd,
                            bankAmount: 0
                        });
                        
                        newData.save();

                        const embed = new MessageEmbed()
                            .setTitle(`${user.username}'s wallet`)
                            .setFields({
                                name: 'Before:',
                                value: `⏣\`0\``,
                                inline: true
                            }, {
                                name: 'New Value:',
                                value: `⏣\`${amountAdd}\``,
                                inline: true
                            }, {
                                name: 'Amount Added:',
                                value: `⏣\`${amountAdd}\``,
                                inline: true,
                            })
                            .setColor('RANDOM')
            
                        return embed
                    } else {
                        walletBal = data.amount;
                        data.amount += amountAdd;
                        data.save();
                    }
    
                const embed = new MessageEmbed()
                    .setTitle(`${user.username}'s wallet`)
                    .setFields({
                        name: 'Before:',
                        value: `⏣\`${walletBal}\``,
                        inline: true
                    }, {
                        name: 'New Value:',
                        value: `⏣\`${data.amount}\``,
                        inline: true
                    }, {
                        name: 'Amount Added:',
                        value: `⏣\`${amountAdd}\``,
                        inline: true,
                    })
                    .setColor('RANDOM')
    
                return embed
    
    
    
            } else if (interaction.options.getString('action') === 'set') {
    
                const data = await  balanceSchema.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id
                });
                
                let walletBalOg;
                
                    if (!data) {
                        const newData = await balanceSchema.create({
                            guildId: interaction.guild.id,
                            userId: user.id,
                            amount: amountAdd,
                            bankAmount: 0
                        });
                        
                        newData.save();

                        const embed = new MessageEmbed()
                            .setTitle(`${user.username}'s wallet`)
                            .setFields({
                                name: 'Before:',
                                value: `⏣\`0\``,
                                inline: true
                            }, {
                                name: 'New Value:',
                                value: `⏣\`${amountAdd}\``,
                                inline: true
                            })
                            .setColor('RANDOM')
            
                        return embed
                    } else {
                        walletBal = data.amount;
                        data.amount = amountAdd;
                        data.save();
                    }
    
                const embed = new MessageEmbed()
                    .setTitle(`${user.username}'s wallet`)
                    .setFields({
                        name: 'Before:',
                        value: `⏣\`${walletBal}\``,
                        inline: true
                    }, {
                        name: 'New Value:',
                        value: `⏣\`${data.amount}\``,
                        inline: true
                    })
                    .setColor('RANDOM')
    
                return embed
    
    
            }
        } else {
            if (interaction.options.getString('action') === 'add') {

                const data = await  balanceSchema.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id
                });
                
                let walletBalOg;
                
                    if (!data) {
                        const newData = await balanceSchema.create({
                            guildId: interaction.guild.id,
                            userId: user.id,
                            amount: 0,
                            bankAmount: amountAdd
                        });
                        
                        newData.save();

                        const embed = new MessageEmbed()
                            .setTitle(`${user.username}'s bank balance`)
                            .setFields({
                                name: 'Before:',
                                value: `⏣\`0\``,
                                inline: true
                            }, {
                                name: 'New Value:',
                                value: `⏣\`${amountAdd}\``,
                                inline: true
                            }, {
                                name: 'Amount Added:',
                                value: `⏣\`${amountAdd}\``,
                                inline: true,
                            })
                            .setColor('RANDOM')
            
                        return embed
                    } else {
                        walletBal = data.bankAmount;
                        data.bankAmount += amountAdd;
                        data.save();
                    }
    
                const embed = new MessageEmbed()
                    .setTitle(`${user.username}'s bank balance`)
                    .setFields({
                        name: 'Before:',
                        value: `⏣\`${walletBal}\``,
                        inline: true
                    }, {
                        name: 'New Value:',
                        value: `⏣\`${data.bankAmount}\``,
                        inline: true
                    }, {
                        name: 'Amount Added:',
                        value: `⏣\`${amountAdd}\``,
                        inline: true,
                    })
                    .setColor('RANDOM')
    
                return embed
    
    
    
            } else if (interaction.options.getString('action') === 'set') {
    
                const data = await  balanceSchema.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id
                });
                
                let walletBalOg;
                
                    if (!data) {
                        const newData = await balanceSchema.create({
                            guildId: interaction.guild.id,
                            userId: user.id,
                            amount: 0,
                            bankAmount: amountAdd
                        });
                        
                        newData.save();

                        const embed = new MessageEmbed()
                            .setTitle(`${user.username}'s bank balance`)
                            .setFields({
                                name: 'Before:',
                                value: `⏣\`0\``,
                                inline: true
                            }, {
                                name: 'New Value:',
                                value: `⏣\`${amountAdd}\``,
                                inline: true
                            })
                            .setColor('RANDOM')
            
                        return embed
                    } else {
                        walletBal = data.bankAmount;
                        data.bankAmount = amountAdd;
                        data.save();
                    }
    
                const embed = new MessageEmbed()
                    .setTitle(`${user.username}'s bank balance`)
                    .setFields({
                        name: 'Before:',
                        value: `⏣\`${walletBal}\``,
                        inline: true
                    }, {
                        name: 'New Value:',
                        value: `⏣\`${data.bankAmount}\``,
                        inline: true
                    })
                    .setColor('RANDOM')
    
                return embed
    
    
            }
        }
    }
}