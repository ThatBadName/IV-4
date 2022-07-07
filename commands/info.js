const { MessageEmbed, InteractionWebhook, MessageActionRow, MessageButton } = require('discord.js')
const botSchema = require('../models/bot-schema')
const setupSchema = require('../models/setup-schema')
const blacklistSchema = require('../models/blacklist-schema')

module.exports = {
    name: 'info',
    category: 'Misc',
    description: 'Get some bot info',
    slash: true,
    guildOnly: true,
    cooldown: '3s',
    
    callback: async ({interaction, client}) => {
        const maintenanceSchema = require('../models/mantenance-schema')
        const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
        const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance && interaction.user.id !== '804265795835265034') {
                const doc = await setupSchema.findOne({guildId: interaction.guild.id})
                if (!doc) setupSchema.create({guildId: interaction.guild.id})
                const announcement = await botSchema.findOne()
                
                var responseTime = Math.round(Date.now() - interaction.createdTimestamp)
                var responseTime = String(responseTime).slice(1)
                let totalSeconds = (client.uptime / 1000);
                let days = Math.floor(totalSeconds / 86400);
                totalSeconds %= 86400;
                let hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                let minutes = Math.floor(totalSeconds / 60);
                let seconds = Math.floor(totalSeconds % 60);

                const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setStyle('LINK')
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=919242400738730005&permissions=1642824465782&scope=bot%20applications.commands')
                    .setLabel('Invite Me')
                )
                .addComponents(
                    new MessageButton()
                    .setStyle('LINK')
                    .setLabel('Support Server')
                    .setURL('https://discord.gg/hK3gEQ2XUf')
                )
                .addComponents(
                    new MessageButton()
                    .setStyle('LINK')
                    .setURL('https://thatbadname.gitbook.io/iv-4-docs/')
                    .setLabel('Documentation')
                )
        
                const embed = new MessageEmbed()
                .setTitle('Bot Info')
                .setDescription(`⚠️**THE BOT IS IN MAINTENANCE MODE** || ${maintenance.maintenanceReason}⚠️\n[Docs](https://thatbadname.gitbook.io/iv-5-docs/) | [Support Server](https://discord.gg/hK3gEQ2XUf)`)
                .addField("Latency:", `\`${String(responseTime)}\`ms`)
                .addField("Ping:", `\`${String(client.ws.ping)}\`ms`)
                .addField("Uptime:", `\`${String(days)}\` days, \`${String(hours)}\` hours, \`${String(minutes)}\` minutes, \`${String(seconds)}\` seconds`)
                .addField("Latest Bot Announcement", `${announcement.announcement}`)
                .addField("Guild Forms", `**Invite:** ${doc.guildInvite || 'None'}\n**Appeal Form:** ${doc.guildAppeal || 'None'}`)
                .setColor('RANDOM')
                .setFooter({text: 'You cannot run commands or interact with the bot in any way | Made by ThatBadName#7967'})
                return interaction.reply({embeds: [embed], components: [row]})
            } else {           
        const doc = await setupSchema.findOne({guildId: interaction.guild.id})
        if (!doc) setupSchema.create({guildId: interaction.guild.id})
        const announcement = await botSchema.findOne()
        
        var responseTime = Math.round(Date.now() - interaction.createdTimestamp)
        var responseTime = String(responseTime).slice(1)
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setStyle('LINK')
            .setURL('https://discord.com/api/oauth2/authorize?client_id=919242400738730005&permissions=1642824465782&scope=bot%20applications.commands')
            .setLabel('Invite Me')
        )
        .addComponents(
            new MessageButton()
            .setStyle('LINK')
            .setLabel('Support Server')
            .setURL('https://discord.gg/hK3gEQ2XUf')
        )
        .addComponents(
            new MessageButton()
            .setStyle('LINK')
            .setURL('https://thatbadname.gitbook.io/iv-4-docs/')
            .setLabel('Documentation')
        )

        const embed = new MessageEmbed()
        .setTitle('Bot Info')
        .addField("Latency:", `\`${String(responseTime)}\`ms`)
        .addField("Ping:", `\`${String(client.ws.ping)}\`ms`)
        .addField("Uptime:", `\`${String(days)}\` days, \`${String(hours)}\` hours, \`${String(minutes)}\` minutes, \`${String(seconds)}\` seconds`)
        .addField("Latest Bot Announcement", `${announcement.announcement}`)
        .setColor('RANDOM')
        .setFooter({text: `${blacklist ? 'You are currently bot-banned. You cannot run any commands' : 'Hello :)'} | Made by ThatBadName#7967`})
        return interaction.reply({embeds: [embed], components: [row]})
            }
    }
}
