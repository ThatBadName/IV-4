const { MessageEmbed } = require('discord.js')
const historySchema = require('./models/history-schema')
const strikeSchema = require('./models/strike-schema')
const setupSchema = require('./models/setup-schema')

async function spamCheck (message, set, time) {
    for (let u of set) {
        
        if (u.id === message.author.id) {
            if (u.times >= 4) {
                message.reply(`${message.author} I have put you into timeout because you were spamming`)

                u.time = Date.now()
                u.times = 0

                const guild = message.guild
                const logChannel = guild.channels.cache.find(channel => channel.name === 'iv-logs')
                const user = message.author
                const member = message.guild.members.cache.get(user.id)
                var reason = `[AUTOMOD] Sending too many messages too quickly | You have also been put into timeout for 2 hours`
                const database = await setupSchema.findOne({guildId: guild.id})

                member.timeout(7200000, reason).catch((err) => {
                    //console.log(err)
                })

                const strike = await strikeSchema.create({
                    userId: user?.id,
                    staffId: '919242400738730005',
                    guildId: guild?.id,
                    reason,
                })

                historySchema.create({
                    userId: user?.id,
                    staffId: '919242400738730005',
                    guildId: guild?.id,
                    reason,
                    punishmentId: strike.id,
                    type: 'strike',
                })
                
                historySchema.create({
                    userId: user?.id,
                    staffId: '919242400738730005',
                    guildId: guild?.id,
                    reason,
                    duration: '2h',
                    type: 'timeout',
                })
                const checkEnabledAutomod = await setupSchema.findOne({guildId: message.guild.id, automodEnabled: false})
                if (checkEnabledAutomod) return
                const checkEnabledLogging = await setupSchema.findOne({guildId: message.guild.id, loggingEnabled: false})

                const logEmbed = new MessageEmbed()
                    .setColor('PURPLE')
                    .setTitle('STRIKE ADD')
                    .setDescription(`${user} has been striken`)
                    .addField("Staff:", `[AUTOMOD]`)
                    .addField("Reason:", `[AUTOMOD] Sending too many messages too quickly | You have also been put into timeout for 2 hours`)
                    .addField("ID:", `\`${strike.id}\``)

                logChannel.send({embeds: [logEmbed]})

                const embed = new MessageEmbed()
                    .setColor('DARK_RED')
                    .setTitle(`**You have been striken [AUTOMOD]**`)
                    .addField("Server:", `${guild}`)
                    .addField("Reason:", `[AUTOMOD] Sending too many messages too quickly | You have also been put into timeout for 2 hours`)
                    .addField("ID:", `\`${strike.id}\``)
                    .setDescription(`[Appeal here](${database.guildAppeal})`)
                    .setFooter({text: 'To view all strikes do \'/liststrikes\''})

                user.send({embeds: [embed]}).catch((err) => {
                    console.log(err)
                })
            } else if ((Date.now() - u.time) <= time) {
                u.times++
                u.time = Date.now()
            } else {
                u.time = Date.now()
                u.times = 1
            }
        }
    }

    let userInSet = false
    set.forEach(u => { 
        if (u.id === message.author.id) userInSet = true 
    })
    
    if (!userInSet) set.add({ id: message.author.id, time: Date.now(), times: 1 })
}

module.exports = { spamCheck }