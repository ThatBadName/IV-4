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
        const database = await setupSchema.findOne({guildId: message.guild.id})
        if (!database) return
        if (message.channel.id === database.advertisingChannelId) return
     
        const words = ['.gg/', 'discord.com/invite', 'discordapp.com/invite', 'gg/']
    
        for (const word of words) {
    
            if (message.content.includes(word)) {
                const guild = message.guild
                const logChannel = guild.channels.cache.find(channel => channel.name === 'iv-logs')
                const user = message.author
                const member = message.guild.members.cache.get(user.id)
                const staff = '919242400738730005'
                const reason = `[AUTOMOD] Posting an invite:\nYou have also been put into timeout for 1 hour`
                try {
                    message.delete().catch((err) => {})
                    message.channel.send(`${user}, Please send ads in ${database.advertisingChannelId ? `<#${database.advertisingChannelId}>` : 'the advertising channel'}`)
    
                    member.timeout(3600000, reason).catch((err) => {
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
                    duration: '1h',
                    type: 'timeout',
                })
        
                    const logEmbed = new MessageEmbed()
                        .setColor('PURPLE')
                        .setTitle('STRIKE ADD')
                        .setDescription(`${user} has been striken`)
                        .addField("Staff:", `[AUTOMOD]`)
                        .addField("Reason:", `[AUTOMOD] Posting an invite:\nYou have also been put into timeout for 1 hour`)
                        .addField("ID:", `\`${strike.id}\``)
        
                    logChannel.send({embeds: [logEmbed]})
        
                    const embed = new MessageEmbed()
                        .setColor('DARK_RED')
                        .setTitle(`**You have been striken [AUTOMOD]**`)
                        .addField("Server:", `${guild}`)
                        .addField("Reason:", `[AUTOMOD] Posting an invite:\nYou have also been put into timeout for 1 hour`)
                        .addField("ID:", `\`${strike.id}\``)
                        .setDescription(`[Appeal here](${database.guildAppeal})`)
                        .setFooter({text: 'To view all strikes do \'/liststrikes\''})
        
                    await user.send({embeds: [embed]}).catch((err) => {
                    })
                } catch (err) {
                }
                break
            }
            
            
        }
    })
}
module.exports.config = {
    dbName: 'AUTOMOD_LINKS',
    displayName: 'AutoMod - links'
}