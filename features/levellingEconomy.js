const { MessageEmbed } = require('discord.js')
const levelrewardSchema = require('../models/levelreward-schema')
const levelSchema = require('../models/leveling-schema')
const maintenanceSchema = require('../models/mantenance-schema')
const blacklistSchema = require('../models/blacklist-schema')
const balanceSchema = require('../models/balance-schema')
const boosterSchema = require('../models/boost-schema')
const today = new Date()

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance && message.author.id !== '804265795835265034') {
                if (message.content.startsWith('<@919242400738730005>')) message.reply(`The bot is currently down for maintenance. You are not able to run any commands other than \`/info\`.\nReason for maintenance:\`\`\`fix\n${maintenance.maintenanceReason}\n\`\`\``)
                return
            }
            const blacklist = await blacklistSchema.findOne({userId: message.author.id})
            if (blacklist) {
                if (message.content.startsWith('<@919242400738730005>')) message.reply(`You are blacklisted from using the bot. You can only run the \`/info\` command.\n\nReason:\`\`\`fix\n${blacklist.reason}\n\`\`\``)
                return
            }

    if(message.channel.type === 'DM') return; 
    if(message.author.bot) return;
    if (message.content.startsWith('<@919242400738730005>')) {
        const pingEmbed = new MessageEmbed()
        .setTitle(`I'm IV-5`)
        .setDescription('If you need any help with the bot please join the [Support Server](https://discord.gg/ArpuxMEa55) or read the [Docs](https://thatbadname.gitbook.io/iv-5-docs/)')
        .setFields({
            name: 'Where are my commands?',
            value: 'I use /commands. Type `/` and you can see a list of them',
            inline: true,
        }, {
            name: 'Is there a help command?',
            value: 'Sorry no. Please read the docs if you want a command list',
            inline: true
        })
        .setColor('RANDOM')
        .setFooter({text: 'This message will only appear if your message starts with my tag'})
        message.reply({embeds: [pingEmbed]})
        return
    }

        const checkBal = await balanceSchema.findOne({guildId: message.guild.id, userId: message.author.id})
        const checkLvl = await levelSchema.findOne({guildId: message.guild.id, userId: message.author.id})

        if (!checkBal || !checkLvl) {
            if (!checkBal) {
                balanceSchema.create({
                    guildId: message.guild.id,
                    userId: message.author.id,
                    amount: 0,
                    bankAmount: 0
                    })
            }
            if (!checkLvl) {
                levelSchema.create({
                    guildId: message.guild.id,
                    userId: message.author.id,
                    xp: 0,
                    level: 0,
                    role: 0
                    })
            }
        }

        balanceSchema.findOne({guildId: message.guild.id, userId: message.author.id}, async(err, doc)=>{
            if(!doc) {
            balanceSchema.create({
            guildId: message.guild.id,
            userId: message.author.id,
            amount: 0,
            bankAmount: 0
            })
            return
            }
            
            });
                    const give = Math.floor(Math.random() * 20)
                    const data = await balanceSchema.findOne({
                        guildId: message.guild.id,
                        userId: message.author.id
                    });
                        data.amount += give;
                        data.save();

            const boost = await boosterSchema.findOne({guildId: message.guild.id, userId: message.author.id, type: 'xp'})

            levelSchema.findOne({guildId: message.guild.id, userId: message.author.id}, async(err, result)=>{
                if(!result) {
                levelSchema.create({
                guildId: message.guild.id,
                userId: message.author.id,
                xp: 0,
                level: 0,
                role: 0
                })
                return
                }
                
                });
                //console.log(today.getDay())
        
                if (boost) {

                    if(today.getDay() == 6 || today.getDay() == 0) {
                            const give = Math.floor((Math.random() * 10) + 1) * boost.strength
                            //console.log(give, `mult`)
                            const data = await levelSchema.findOne({
                                guildId: message.guild.id,
                                userId: message.author.id
                            });
        
                            const requiredXp = data.level * 500 + 100
                            if (data.xp + give >= requiredXp) {
                                data.xp = 0;
                                data.level += 1
                                data.save()
                                message.channel.send(`XP Booster | ${message.author}, You have leveled up to **Level ${data.level}** (Since its the weekend you get double xp. You are also more likely to get some)`)
                            } else {
                                data.xp += give;
                                data.save();
                            }
                            const nextRoleCheck = await levelrewardSchema.findOne({guildId: message.guild.id, level: data.level})
                            if (nextRoleCheck) {
                                const levelRole = nextRoleCheck.role.replace(/[<@!&>]/g, '')
                                const userLevel = await levelSchema.findOne({guildId: message.guild.id, userId: message.author.id})
                                const prevRoleId = userLevel.role
                                if (message.member.roles.cache.has(levelRole)) {
                                    return
                                } else {
                                    message.member.roles.remove(prevRoleId).catch((err => {}))
                                    message.member.roles.add(levelRole)
                                
                                    userLevel.role = levelRole
                                    userLevel.save()
                                }
                            }
                    } else {
                            const give = Math.floor(Math.random() * 5) + 1 * boost.strength
                            //console.log(give, `norm`)
                            const data = await levelSchema.findOne({
                                guildId: message.guild.id,
                                userId: message.author.id
                            });
        
                            const requiredXp = data.level * 500 + 100
                            if (data.xp + give >= requiredXp) {
                                data.xp = 0;
                                data.level += 1
                                data.save()
                                message.channel.send(`XP Booster | ${message.author}, You have leveled up to **Level ${data.level}**`)
                            } else {
                                data.xp += give;
                                data.save();
                            }
                            const nextRoleCheck = await levelrewardSchema.findOne({guildId: message.guild.id, level: data.level})
                            if (nextRoleCheck) {
                                const levelRole = nextRoleCheck.role.replace(/[<@!&>]/g, '')
                                const userLevel = await levelSchema.findOne({guildId: message.guild.id, userId: message.author.id})
                                const prevRoleId = userLevel.role
                                if (message.member.roles.cache.has(levelRole)) {
                                    return
                                } else {
                                    message.member.roles.remove(prevRoleId).catch((err => {}))
                                    message.member.roles.add(levelRole)
                                
                                    userLevel.role = levelRole
                                    userLevel.save()
                                }
                            }
                    }

                } else {
                    if(today.getDay() == 6 || today.getDay() == 0) {
                            const give = Math.floor(Math.random() * 10) + 1
                            //console.log(give, `mult`)
                            const data = await levelSchema.findOne({
                                guildId: message.guild.id,
                                userId: message.author.id
                            });
        
                            const requiredXp = data.level * 500 + 100
                            if (data.xp + give >= requiredXp) {
                                data.xp = 0;
                                data.level += 1
                                data.save()
                                message.channel.send(`${message.author}, You have leveled up to **Level ${data.level}** (Since its the weekend you get double xp. You are also more likely to get some)`)
                            } else {
                                data.xp += give;
                                data.save();
                            }
                            const nextRoleCheck = await levelrewardSchema.findOne({guildId: message.guild.id, level: data.level})
                            if (nextRoleCheck) {
                                const levelRole = nextRoleCheck.role.replace(/[<@!&>]/g, '')
                                const userLevel = await levelSchema.findOne({guildId: message.guild.id, userId: message.author.id})
                                const prevRoleId = userLevel.role
                                if (message.member.roles.cache.has(levelRole)) {
                                    return
                                } else {
                                    message.member.roles.remove(prevRoleId).catch((err => {}))
                                    message.member.roles.add(levelRole)
                                
                                    userLevel.role = levelRole
                                    userLevel.save()
                                }
                            }
                    } else {
                            const give = Math.floor(Math.random() * 5) + 1
                            const data = await levelSchema.findOne({
                                guildId: message.guild.id,
                                userId: message.author.id
                            });
        
                            const requiredXp = data.level * 500 + 100
                            if (data.xp + give >= requiredXp) {
                                data.xp = 0;
                                data.level += 1
                                data.save()
                                message.channel.send(`${message.author}, You have leveled up to **Level ${data.level}**`)
                            } else {
                                data.xp += give;
                                data.save();
                            }
                            const nextRoleCheck = await levelrewardSchema.findOne({guildId: message.guild.id, level: data.level})
                            if (nextRoleCheck) {
                                const levelRole = nextRoleCheck.role.replace(/[<@!&>]/g, '')
                                const userLevel = await levelSchema.findOne({guildId: message.guild.id, userId: message.author.id})
                                const prevRoleId = userLevel.role
                                if (message.member.roles.cache.has(levelRole)) {
                                    return
                                } else {
                                    message.member.roles.remove(prevRoleId).catch((err => {}))
                                    message.member.roles.add(levelRole)
                                
                                    userLevel.role = levelRole
                                    userLevel.save()
                                }
                            }
                            
                        }
                    }
    })
}
module.exports.config = {
    dbName: 'Levelling',
    displayName: 'Levelling and economy'
}