const {MessageEmbed} = require('discord.js')
const setupSchema = require('../models/setup-schema')
const historySchema = require('../models/history-schema')
const strikeSchema = require('../models/strike-schema')

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        const maintenanceSchema = require('../models/mantenance-schema')
        const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance && message.author.id !== '804265795835265034') {
                return
            }
        if(message.author.bot) return;
        if(message.channel.type === 'DM') return;
        if(message.member.permissions.has("ADMINISTRATOR")) return
        if(message.channel.id === '963476714124632126') return;
        const checkEnabledAutomod = await setupSchema.findOne({guildId: message.guild.id, automodEnabled: false})
        if (checkEnabledAutomod) return
        const checkEnabledLogging = await setupSchema.findOne({guildId: message.guild.id, loggingEnabled: false})
        const database = await setupSchema.findOne({guildId: message.guild.id})
     
        const words = ['nigg', 'Nigg', 'NIGG', 'n1gg', 'N1gg', 'N1GG', 'n!gg', 'N!gg', 'N!GG', 'filtertest1234%%__', "paki", "pak1", "pak!", "Paki", "Pak1", "Pak!", "PAKI", "PAK1", "PAK!", "paky", "Paky", "paci", "pac1", "pak!", "Paci", "Pac1", "Pac!", "PAC1", "PACI", "PAC!", "n!g", "N!g", "N!G", "n1g", "N1g", "N1G", "fag", "Fag", "FAG", "nlg", "Nlg", "NLG"]
    
        for (const word of words) {
    
            if (message.content.includes(word)) {
                const guild = message.guild
                const logChannel = guild.channels.cache.find(channel => channel.name === 'iv-logs')
                const user = message.author
                const member = message.guild.members.cache.get(user.id)
                const staff = '919242400738730005'
                const reason = `Saying a blacklisted word (message bellow):\n\n\`\`\`${message.content}\`\`\``
                try {
                    message.delete();
                    message.channel.send(`${user}, Please don't say that`)
    
                    member.timeout(43200000, reason).catch((err) => {
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
                    duration: '12h',
                    type: 'timeout',
                })

                if (checkEnabledLogging) return
        
                    const logEmbed = new MessageEmbed()
                        .setColor('PURPLE')
                        .setTitle('STRIKE ADD')
                        .setDescription(`${user} has been striken`)
                        .addField("Staff:", `[AUTOMOD]`)
                        .addField("Reason:", `[AUTOMOD] Saying a blacklisted word (message bellow):\n\n\`\`\`${message.content}\`\`\`You have also been put into timeout for 12 hours`)
                        .addField("ID:", `\`${strike.id}\``)
        
                    logChannel.send({embeds: [logEmbed]})
        
                    const embed = new MessageEmbed()
                        .setColor('DARK_RED')
                        .setTitle(`**You have been striken [AUTOMOD]**`)
                        .addField("Server:", `${guild}`)
                        .addField("Reason:", `[AUTOMOD] Saying a blacklisted word (message bellow):\n\n\`\`\`${message.content}\`\`\`You have also been put into timeout for 12 hours`)
                        .addField("ID:", `\`${strike.id}\``)
                        .setDescription(`[Appeal here](${database.guildAppeal})`)
                        .setFooter({text: 'To view all strikes do \'/liststrikes\''})
        
                    await user.send({embeds: [embed]}).catch((err) => {
                        console.log(err)
                    })
                } catch (err) {
                    console.log(err)
                }
            }
            
            
        }
    
        try {
            
            if (message.mentions.members.size > 5) {
            message.channel.send(`${message.author} Please don't mass ping users`)
    
            try {
                const guild = message.guild
                const logChannel = guild.channels.cache.find(channel => channel.name === 'iv-logs')
                const user = message.author
                const member = message.guild.members.cache.get(user.id)
                var reason = `[AUTOMOD] Pinging too many users (${message.mentions.members.size} users) | You have also been put into timeout for 6 hours`
    
                member.timeout(21600000, reason).catch((err) => {
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
                    type: 'timeout',
                })
    
                const logEmbed = new MessageEmbed()
                    .setColor('PURPLE')
                    .setTitle('STRIKE ADD')
                    .setDescription(`${user} has been striken`)
                    .addField("Staff:", `[AUTOMOD]`)
                    .addField("Reason:", `[AUTOMOD] Pinging too many users (${message.mentions.members.size} users) | You have also been put into timeout for 6 hours`)
                    .addField("ID:", `\`${strike.id}\``)
    
                logChannel.send({embeds: [logEmbed]})
    
                const embed = new MessageEmbed()
                    .setColor('DARK_RED')
                    .setTitle(`**You have been striken [AUTOMOD]**`)
                    .addField("Server:", `${guild}`)
                    .addField("Reason:", `[AUTOMOD] Pinging too many users (${message.mentions.members.size} users) | You have also been put into timeout for 6 hours`)
                    .addField("ID:", `\`${strike.id}\``)
                    .setDescription(`[Appeal here](${database.guildAppeal})`)
                    .setFooter({text: 'To view all strikes do \'/liststrikes\''})
    
                user.send({embeds: [embed]}).catch((err) => {
                    console.log(err)
                })
            } catch (err) {
                console.log(err)
            }
    
        }
        } catch (err) {
            //console.log(err)
        }
    })
}
module.exports.config = {
    dbName: 'AUTOMOD_FILTER',
    displayName: 'AutoMod - filter'
}