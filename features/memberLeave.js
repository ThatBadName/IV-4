const { MessageEmbed } = require('discord.js')
const setupSchema = require('../models/setup-schema')

module.exports = (client) => {
   client.on('guildMemberRemove', async(member) => {
        const { guild } = member 
        const result = await setupSchema.findOne({guildId: guild.id})
        const channel = guild.channels.cache.get(result.logChannelId)
        if (!channel) return
        if (!result) return

        const logEmbed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`Member Left`)
        .setDescription(`${member} has left the server`)
        .setThumbnail(member.displayAvatarURL({ dynamic: true}))
        .setFooter({text: `User: ${member.tag} | ID: ${member.id}`})

        channel.send({embeds: [logEmbed]})
   })
},

module.exports.config = {
   dbName: 'MEMBERLEAVE',
   displayName: 'Member Leave',
}