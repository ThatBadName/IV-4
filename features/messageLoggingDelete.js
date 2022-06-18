const { MessageEmbed } = require('discord.js')
const setupSchema = require('../models/setup-schema')

module.exports = (client) => {
   client.on('messageDelete', async(message) => {
      const checkEnabledLogging = await setupSchema.findOne({guildId: message.guild.id, loggingEnabled: false})
      if (checkEnabledLogging) return
      const result = await setupSchema.findOne({guildId: message.guild.id})
        const channel = message.guild.channels.cache.get(result.logChannelId)
        if (!result) return
        if (message.author.bot) return
        if (!channel) return

        const count = 1950

        const original = message.content.slice(0, count) + (message.content.length > 1950 ? "..." : "")

        const logEmbed = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle(`Message Deleted`)
        .setDescription(`A message by ${message.author} has been deleted in ${message.channel})\n
        **Message**:\n\`\`\`${original}\`\`\``)
        .setFooter({text: `User: ${message.author.tag} | ID: ${message.author.id}`})

        channel.send({embeds: [logEmbed]})
   })
},

module.exports.config = {
   dbName: 'MESSAGELOGDELETE',
   displayName: 'Message Logging - Delete',
}