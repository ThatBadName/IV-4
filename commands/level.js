const { MessageEmbed, InteractionWebhook, MessageAttachment } = require('discord.js')
const levelSchema = require('../models/leveling-schema')
const canvacord = require('canvacord')
const setupSchema = require('../models/setup-schema')

module.exports = {
    name: 'level',
    description: 'View levels and the leaderboard.',
    category: 'Fun',
    slash: true,
    guildOnly: true,
    cooldown: '3s',
    options: [
        {
            name: 'view',
            description: 'View the level of you or someone else',
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
            name: 'leaderboard',
            description: 'Get the top 15 users',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'type',
                    description: 'Choose how to rank the leaderboard',
                    type: 'STRING',
                    required: true,
                    choices: [
                        {
                            name: 'xp',
                            value: 'xp',
                        },
                        {
                            name: 'level',
                            value: 'level',
                        },
                    ],
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
            }
        const setup = await setupSchema.findOne({guildId: interaction.guild.id})
        if (interaction.options.getSubcommand() === 'view') {
            if (interaction.options.getUser('user')) {
                const user = interaction.options.getUser('user')
    
                const userBal = levelSchema.findOne({userId: user.id}, async(err, bal)=>{
                    if(!bal) {
                    return `I could not find the user in my database`
                    }
                    
                    });
                    const walletBal = await levelSchema.findOne({
                        userId: user.id,
                        guildId: interaction.guild.id,
                    })
    
                if (!walletBal) {

                    const balEmbed = new MessageEmbed()
                    .setTitle(`${user.username}'s level`)
                    .setDescription(`${user.tag} does not have a rank. Send some messages to get one`)
                    .setColor('RANDOM')
                    return balEmbed
                } else {
                    const required = walletBal.level * 500 + 100
                    if(setup.rankCard === false) {
                        const balEmbed = new MessageEmbed()
                            .setTitle(`${user.username}'s level`)
                            .setDescription(`**XP:** \`${walletBal.xp}/${required}\` (${Math.round(walletBal.xp/required*100)}%)\n**Level:** \`${walletBal.level}\``)
                            .setColor('RANDOM')
                            return balEmbed
                    } else {
                        const rankCard = new canvacord.Rank()
                            .setAvatar(user.displayAvatarURL({dynamic: false, format: 'png'}))
                            .setCurrentXP(walletBal.xp)
                            .setRequiredXP(walletBal.level * 500 + 100)
                            .setProgressBar('#FFA500', 'COLOR', true)
                            .setUsername(user.username)
                            .setLevel(walletBal.level)
                            .setDiscriminator(user.discriminator)
                            .setRank(1, 'none', false)
                            .setCustomStatusColor('#FFA500')
                            rankCard.build().then(data => {
                                const attactment = new MessageAttachment(data, 'level.png')
                                interaction.reply({files: [attactment]})
                            })
                    }
                }
            } else {
                const user = interaction.user
    
                const userBal = levelSchema.findOne({userId: user.id}, async(err, bal)=>{
                    if(!bal) {
                    return `I could not find the user in my database`
                    }
                    
                    });
                    const walletBal = await levelSchema.findOne({
                        userId: user.id,
                        guildId: interaction.guild.id,
                    })
    
                if (!walletBal) {
                    const balEmbed = new MessageEmbed()
                    .setTitle(`${user.username}'s level`)
                    .setDescription(`${user.tag} does not have a rank. Send some messages to get one`)
                    .setColor('RANDOM')
                    return balEmbed
                } else {
                    const required = walletBal.level * 500 + 100
                    if(setup.rankCard === false) {
                        const balEmbed = new MessageEmbed()
                            .setTitle(`${user.username}'s level`)
                            .setDescription(`**XP:** \`${walletBal.xp}/${required}\` (${Math.round(walletBal.xp/required*100)}%)\n**Level:** \`${walletBal.level}\``)
                            .setColor('RANDOM')
                            return balEmbed
                    } else {
                        const rankCard = new canvacord.Rank()
                            .setAvatar(user.displayAvatarURL({dynamic: false, format: 'png'}))
                            .setCurrentXP(walletBal.xp)
                            .setRequiredXP(walletBal.level * 500 + 100)
                            .setProgressBar('#FFA500', 'COLOR', true)
                            .setLevel(walletBal.level)
                            .setUsername(user.username)
                            .setDiscriminator(user.discriminator)
                            .setRank(1, 'none', false)
                            .setCustomStatusColor('#FFA500')
                            rankCard.build().then(data => {
                                const attactment = new MessageAttachment(data, 'level.png')
                                interaction.reply({files: [attactment]})
                            })
                    }
                }
            }
        } else if (interaction.options.getSubcommand() === 'leaderboard') {
                if (interaction.options.getString('type') === 'xp') {
                    let text = ''
                    const results = await levelSchema.find({
                        guildId: interaction.guild.id,

                    }).sort({
                        xp: -1
                    }).limit(15)

                    for (let counter = 0; counter < results.length; ++counter) {
                        const { userId, xp = 0 } = results[counter]

                        text += `**#${counter + 1}** <@${userId}> - \`${xp}\`\n`
                    }
                    const lbEmbed = new MessageEmbed()
                    .setTitle('XP Leaderboard')
                    .setColor('RANDOM')
                    .setDescription(text)
                    return lbEmbed
                } else {
                    let text = ''
                    const results = await levelSchema.find({
                        guildId: interaction.guild.id,

                    }).sort({
                        level: -1
                    }).limit(15)

                    for (let counter = 0; counter < results.length; ++counter) {
                        const { userId, level = 0 } = results[counter]

                        text += `**#${counter + 1}** <@${userId}> - \`${level}\`\n`
                    }
                    const lbEmbed = new MessageEmbed()
                    .setTitle('Level Leaderboard')
                    .setColor('RANDOM')
                    .setDescription(text)
                    return lbEmbed
                }
            }
    }
}