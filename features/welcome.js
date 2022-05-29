const { MessageEmbed } = require('discord.js')
const welcomeSchema = require('../models/welcome-schema')
const welcomeData = {}

module.exports = (client) => {
   client.on('guildMemberAdd', async member => {

       const { guild, id } = member

       const results = await welcomeSchema.findOne({guildId: guild.id})
       if (!results) return
       if (!results.wrId) return
       if (!results.wcId) return
       if (!results.message) return

       const channel = await guild.channels.cache.get(results.wcId)
       const role = await guild.roles.cache.get(results.wrId)

       const embed = new MessageEmbed()
       .setTitle('A new member joined!')
       .setDescription(`${results.message.replaceAll('{member}', `${member}`).replaceAll('{memberCount}', `${guild.memberCount}`).replaceAll('/n/', '\n')}`)
       .setColor('RANDOM')

       channel.send({embeds: [embed]})
       member.roles.add(role)
})
},

module.exports.config = {
   dbName: 'WELCOME',
   displayName: 'Welcome',
}