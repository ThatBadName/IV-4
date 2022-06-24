const { MessageEmbed } = require('discord.js')
const moment = require('moment')
const levelSchema = require('../models/leveling-schema')
const balanceSchema = require('../models/balance-schema')

module.exports = {
    name: 'whois',
    description: 'Get info on a user',
    category: 'Fun',
    slash: true,
    guildOnly: true,
    cooldown: '5s',
    expectedArgs: '[user]',
    options: [
        {
            name: 'user',
            description: 'The user to view',
            type: 'USER',
            required: false,
        },
    ],
    callback: async({interaction}) => {
        const blacklistSchema = require('../models/blacklist-schema')
        const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
        if (blacklist) {
            return
        }
        const maintenanceSchema = require('../models/mantenance-schema')
        const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance && interaction.user.id !== '804265795835265034') {
                return
            }
            
        if(interaction.options.getUser('user')) {
            const user = interaction.options.getUser('user')
            //const data = await levelSchema.findOne({guildId: interaction.guild.id, userId: user.id})
            //const data2 = await balanceSchema.findOne({guildId: interaction.guild.id, userId: user.id})
            const member = interaction.options.getMember('user')
            const roles = member.roles.cache.filter((roles) => roles.id !== interaction.guild.id).map((role) => role.toString())
            //const requiredXp = data.level * data.level * 100 + 100
            const embed = new MessageEmbed()
            .setTitle(`${user.username}#${user.discriminator}`)
            .addField('Tag', `${user}`)
            .addField('Username', `${user.username}`)
            .addField('Discriminator', `#${user.discriminator}`)
            .addField('ID', `\`${user.id}\``)
            .addField('Account Created', `<t:${Math.round(moment.utc(user.createdAt.getTime() / 1000))}> (<t:${Math.round(moment.utc(user.createdAt.getTime() / 1000))}:R>)`)
            .addField('Joined Server', `<t:${Math.round(moment.utc(member.joinedAt / 1000))}> (<t:${Math.round(moment.utc(member.joinedAt / 1000))}:R>)`)
            .addField('Account Type', `${user.bot ? 'Bot' : 'Human'}`)
            .addField('Roles:', `${roles}`)
            //.addField('Level', `**XP:** \`${data.xp}/${data.level * data.level * 100 + 100}\` (${Math.round(data.xp / requiredXp * 100)}%)\n**Level:** \`${data.level}\``)
            //.addField('Balance', `⏣\`${data2.amount}\``)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor('RANDOM')
            return embed
        } else {
            const user = interaction.user
            //const data = await levelSchema.findOne({guildId: interaction.guild.id, userId: user.id})
            //const data2 = await balanceSchema.findOne({guildId: interaction.guild.id, userId: user.id})
            const member = interaction.member
            const roles = member.roles.cache.filter((roles) => roles.id !== interaction.guild.id).map((role) => role.toString())
            //const requiredXp = data.level * data.level * 100 + 100
            const embed = new MessageEmbed()
            .setTitle(`${user.username}#${user.discriminator}`)
            .addField('Tag', `${user}`)
            .addField('Username', `${user.username}`)
            .addField('Discriminator', `#${user.discriminator}`)
            .addField('ID', `\`${user.id}\``)
            .addField('Account Created', `<t:${Math.round(moment.utc(user.createdAt.getTime() / 1000))}> (<t:${Math.round(moment.utc(user.createdAt.getTime() / 1000))}:R>)`)
            .addField('Joined Server', `<t:${Math.round(moment.utc(member.joinedAt / 1000))}> (<t:${Math.round(moment.utc(member.joinedAt / 1000))}:R>)`)
            .addField('Account Type', `${user.bot ? 'Bot' : 'Human'}`)
            .addField('Roles:', `${roles}`)
            //.addField('Level', `**XP:** \`${data.xp}/${data.level * data.level * 100 + 100}\` (${Math.round(data.xp / requiredXp * 100)}%)\n**Level:** \`${data.level}\``)
            //.addField('Balance', `⏣\`${data2.amount}\``)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor('RANDOM')
            return embed
        }
    }
}
