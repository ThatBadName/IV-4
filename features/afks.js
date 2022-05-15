const { MessageEmbed } = require('discord.js');
const afkSchema = require('../models/afk-schema')

module.exports = (client) => {
   client.on('messageCreate', async(message) => {
    if(message.channel.type === 'DM') return; 
    if(message.author.bot) return;

    const blacklistSchema = require('../models/blacklist-schema')
    const blacklist = await blacklistSchema.findOne({userId: message.author.id})
    if (blacklist) {
        return
    }
    const maintenanceSchema = require('../models/mantenance-schema')
    const maintenance = await maintenanceSchema.findOne({maintenance: true})
        if (maintenance && message.author.id !== '804265795835265034') {
            return
        }

    const afkCheck = await afkSchema.findOne({guildId: message.guild.id, userId: message.author.id})
    if (afkCheck) {
        const embed = new MessageEmbed()
            .setTitle('Welcome back!')
            .setDescription(`You went afk <t:${Math.round(afkCheck.time.getTime() / 1000)}:R>`)
            .setColor('RANDOM')
        message.reply({embeds: [embed]}).then(msg => {setTimeout(() => msg.delete(), 15000)})
        afkCheck.delete()
    } else {
        const firstMention = message.mentions.users.first()
        if (!firstMention) return
        const checkIfUserAfk = await afkSchema.findOne({guildId: message.guild.id, userId: firstMention.id})
        if (checkIfUserAfk) {
            const embed = new MessageEmbed()
            .setTitle('This user is afk')
            .setDescription(`${firstMention} is currently afk: ${checkIfUserAfk.reason}.\nThey went afk <t:${Math.round(checkIfUserAfk.time.getTime() / 1000)}:R>`)
            .setColor('RANDOM')
            .setFooter({text: `It's not nice to ping people who are afk`})
            message.reply({embeds: [embed]})
        }
    }

})
},

module.exports.config = {
   dbName: 'AFKS',
   displayName: 'Afks',
}