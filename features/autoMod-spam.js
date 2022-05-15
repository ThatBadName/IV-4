const {MessageEmbed} = require('discord.js')
const setupSchema = require('../models/setup-schema')
const historySchema = require('../models/history-schema')
const strikeSchema = require('../models/strike-schema')
const antispamSchema = require('../models/antispam-schema')
const maintenanceSchema = require('../models/mantenance-schema')

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance && message.author.id !== '804265795835265034') {
                return
            }

    const database = await setupSchema.findOne({guildId: message.guild.id})

    if(message.channel.type === 'DM') return; 
    if(message.author.bot) return;
    if(message.channel.name === 'spam') return;
    if(message.channel.id === '963476714124632126') return;
    if(message.member.permissions.has("ADMINISTRATOR")) return
    const document = antispamSchema.findOne({userId: message.author.id, guildId: message.guild.id}, async(err, doc)=>{
        if(!doc) {
        document.create({
            guildId: message.guild.id,
            userId: message.author.id,
            messages: 0,
        })
        }
        
        });

        document.updateOne({userId: message.author.id, guildId: message.guild.id}, {$inc: {messages:+1}}, {upsert: true})
        
        //update doc here outside the scope of the data it found/didn't find. 


        const messageCount = await antispamSchema.findOne({
            guildId: message.guild.id,
            userId: message.author.id,
        })

        if (!messageCount) return

        if (messageCount.messages > 30) {
        message.channel.send(`${message.author} Please don't spam`)

        try {
            const guild = message.guild
            const logChannel = guild.channels.cache.find(channel => channel.name === 'iv-logs')
            const user = message.author
            const member = message.guild.members.cache.get(user.id)
            var reason = `[AUTOMOD] Sending too many messages too quickly | You have also been put into timeout for 2 hours`

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
        } catch (err) {
            console.log(err)
        }
    }
    })
}
module.exports.config = {
    dbName: 'AUTOMOD_SPAM',
    displayName: 'Automod - Spam'
}