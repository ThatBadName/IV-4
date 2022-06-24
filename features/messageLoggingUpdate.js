const { MessageEmbed } = require("discord.js")
const setupSchema = require('../models/setup-schema')

module.exports = (client) => {
   client.on('messageUpdate', async(oldMessage, newMessage) => {
      const guild = oldMessage.guild
      if (!guild) return
      const checkEnabledLogging = await setupSchema.findOne({guildId: oldMessage.guild.id, loggingEnabled: false})
      if (checkEnabledLogging) return
      const result = await setupSchema.findOne({guildId: oldMessage.guild.id})
      if (!result) return
      const channel = oldMessage.guild.channels.cache.get(result.logChannelId)
      if (oldMessage.author.bot) return
      if (oldMessage.content === newMessage.content) return
      if (!channel) return

        const count = 1900

        const original = oldMessage.content.slice(0, count) + (oldMessage.content.length > 1900 ? "..." : "")
        const edited = newMessage.content.slice(0, count) + (newMessage.content.length > 1900 ? "..." : "")

        const logEmbed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`Message Edited`)
        .setDescription(`A [message](${newMessage.url}) by ${newMessage.author} has been edited in ${newMessage.channel})\n**Original**:\n\`\`\`${original}\`\`\`\n**Edited**:\n\`\`\`${edited}\`\`\``)
        .setFooter({text: `User: ${newMessage.author.tag} | ID: ${newMessage.author.id}`})

        channel.send({embeds: [logEmbed]})
})
},

module.exports.config = {
   dbName: 'MSGLOGGINUPDATE',
   displayName: 'Update Message Logging',
}