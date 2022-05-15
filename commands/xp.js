const {
    MessageEmbed
} = require('discord.js')
const levelSchema = require('../models/leveling-schema')
const setupSchema = require('../models/setup-schema')

module.exports = {
    name: 'xp',
    description: 'Manage a users xp.',
    category: 'Fun',
    slash: true,
    ownerOnly: true,
    options: [
        {
            name: 'manage',
            description: 'Manage a users xp and level',
            type: 'SUB_COMMAND',
            options: [
                {
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
                    name: 'type',
                    description: 'Choose to set the level or xp',
                    type: 'STRING',
                    required: true,
                    choices: [
                        {
                            name: 'level',
                            value: 'level'
                        },
                        {
                            name: 'xp',
                            value: 'xp'
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
                    description: 'The amount of xp',
                    type: 'NUMBER',
                    required: true,
                },
            ],
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
        const maintenanceSchema = require('../models/mantenance-schema')
        const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance && interaction.user.id !== '804265795835265034') {
                return
            }
        const user = interaction.options.getUser('user');
        let amountAdd = interaction.options.getNumber('amount')
        const type = interaction.options.getString('type')

        if (interaction.options.getSubcommand() === 'manage') {
            if (type === 'xp') {
                if (interaction.options.getString('action') === 'add') {
    
                    const data = await  levelSchema.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id
                    });
                    
                    let walletBalOg;
                    
                        if (!data) {
                            const newData = await levelSchema.create({
                                guildId: interaction.guild.id,
                                userId: user.id,
                                xp: amountAdd,
                                level: 0
                            });
                            
                            newData.save();

                            const embed = new MessageEmbed()
                                .setTitle(`${user.username}'s XP`)
                                .setFields({
                                    name: 'Before:',
                                    value: `\`0\``,
                                    inline: true
                                }, {
                                    name: 'New Value:',
                                    value: `\`${amountAdd}\``,
                                    inline: true
                                }, {
                                    name: 'Amount Added:',
                                    value: `\`${amountAdd}\``,
                                    inline: true,
                                })
                                .setColor('RANDOM')
                
                            return embed
                        } else {
                            walletBal = data.xp;
                            data.xp += amountAdd;
                            data.save();
                        }
        
                    const embed = new MessageEmbed()
                        .setTitle(`${user.username}'s XP`)
                        .setFields({
                            name: 'Before:',
                            value: `\`${walletBal}\``,
                            inline: true
                        }, {
                            name: 'New Value:',
                            value: `\`${data.xp}\``,
                            inline: true
                        }, {
                            name: 'Amount Added:',
                            value: `\`${amountAdd}\``,
                            inline: true,
                        })
                        .setColor('RANDOM')
        
                    return embed
        
        
        
                } else if (interaction.options.getString('action') === 'set') {
        
                    const data = await  levelSchema.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id
                    });
                    
                    let walletBalOg;
                    
                        if (!data) {
                            const newData = await levelSchema.create({
                                guildId: interaction.guild.id,
                                userId: user.id,
                                xp: amountAdd,
                                level: 0
                            });
                            
                            newData.save();
                            const embed = new MessageEmbed()
                                .setTitle(`${user.username}'s XP`)
                                .setFields({
                                    name: 'Before:',
                                    value: `\`0\``,
                                    inline: true
                                }, {
                                    name: 'New Value:',
                                    value: `\`${amountAdd}\``,
                                    inline: true
                                })
                                .setColor('RANDOM')
        
                    return embed
                        } else {
                            walletBal = data.xp;
                            data.xp = amountAdd;
                            data.save();
                        }
        
                    const embed = new MessageEmbed()
                        .setTitle(`${user.username}'s XP`)
                        .setFields({
                            name: 'Before:',
                            value: `\`${walletBal}\``,
                            inline: true
                        }, {
                            name: 'New Value:',
                            value: `\`${data.xp}\``,
                            inline: true
                        })
                        .setColor('RANDOM')
        
                    return embed
        
        
                }
            } else {
                if (interaction.options.getString('action') === 'add') {
    
                    const data = await  levelSchema.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id
                    });
                    
                    let walletBalOg;
                    
                        if (!data) {
                            const newData = await levelSchema.create({
                                guildId: interaction.guild.id,
                                userId: user.id,
                                xp: 0,
                                level: amountAdd
                            });
                            
                            newData.save();

                            const embed = new MessageEmbed()
                                .setTitle(`${user.username}'s level`)
                                .setFields({
                                    name: 'Before:',
                                    value: `\`0\``,
                                    inline: true
                                }, {
                                    name: 'New Value:',
                                    value: `\`${amountAdd}\``,
                                    inline: true
                                }, {
                                    name: 'Amount Added:',
                                    value: `\`${amountAdd}\``,
                                    inline: true,
                                })
                                .setColor('RANDOM')
                
                            return embed
                        } else {
                            walletBal = data.level;
                            data.level += amountAdd;
                            data.save();
                        }
        
                    const embed = new MessageEmbed()
                        .setTitle(`${user.username}'s level`)
                        .setFields({
                            name: 'Before:',
                            value: `\`${walletBal}\``,
                            inline: true
                        }, {
                            name: 'New Value:',
                            value: `\`${data.level}\``,
                            inline: true
                        }, {
                            name: 'Amount Added:',
                            value: `\`${amountAdd}\``,
                            inline: true,
                        })
                        .setColor('RANDOM')
        
                    return embed
        
        
        
                } else if (interaction.options.getString('action') === 'set') {
        
                    const data = await  levelSchema.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id
                    });
                    
                    let walletBalOg;
                    
                        if (!data) {
                            const newData = await levelSchema.create({
                                guildId: interaction.guild.id,
                                userId: user.id,
                                xp: 0,
                                level: amountAdd
                            });
                            
                            newData.save();

                            const embed = new MessageEmbed()
                                .setTitle(`${user.username}'s level`)
                                .setFields({
                                    name: 'Before:',
                                    value: `\`0\``,
                                    inline: true
                                }, {
                                    name: 'New Value:',
                                    value: `\`${amountAdd}\``,
                                    inline: true
                                })
                                .setColor('RANDOM')
                
                            return embed
                        } else {
                            walletBal = data.level;
                            data.level = amountAdd;
                            data.save();
                        }
        
                    const embed = new MessageEmbed()
                        .setTitle(`${user.username}'s level`)
                        .setFields({
                            name: 'Before:',
                            value: `\`${walletBal}\``,
                            inline: true
                        }, {
                            name: 'New Value:',
                            value: `\`${data.level}\``,
                            inline: true
                        })
                        .setColor('RANDOM')
        
                    return embed
        
        
                }
            }
        } 
    }
}