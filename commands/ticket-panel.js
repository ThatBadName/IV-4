const { Client, Message, MessageEmbed,  MessageButton, MessageActionRow, CommandInteraction } = require('discord.js');

module.exports = {
    name: 'ticket-panel',
    description: "Sends a ticket pannel to a channel.",
    category: "Admin",
    permissions: ['ADMINISTRATOR'],
    slash: true,
    guildOnly: true,
    options: [
        {
            name: 'channel',
            description: 'The channel to send the panel in',
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT', 'GUILD_PRIVATE_THREAD', 'GUILD_PUBLIC_THREAD', 'GUILD_NEWS_THREAD', 'GUILD_NEWS'],
            required: true
        },
    ],
    callback: async ({interaction}) => {
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
        const guild = interaction.guild;
        const channel = interaction.options.getChannel('channel')

        const embed = new MessageEmbed()
            .setColor('0xFF3D15')
            .setTitle('Open a ticket')
            .setDescription(
                "__**How to make a ticket**__\n" +
                "> Click on the button that relates to your issue\n" +
                "> Once the ticket is made you will be able to get the help you need\n" +
                "> Do not create a ticket if you don't need help. It will get you punished"
            )
            .setTitle('Tickets')

            const bt = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('player')
                .setLabel('Report a player')
                .setEmoji('<:security:944350352797483059>')
                .setStyle('SUCCESS'),
            )
            .addComponents(
                new MessageButton()
                .setCustomId('bug')
                .setLabel('Report a bug')
                .setEmoji('<:dnd_status:923209325990801428>')
                .setStyle('SUCCESS'),
            )
            .addComponents(
                new MessageButton()
                .setCustomId('feed')
                .setLabel('Send some feedback')
                .setEmoji('<:boost:923209020607717437>')
                .setStyle('SUCCESS'),
            )
            .addComponents(
                new MessageButton()
                .setCustomId('staff')
                .setLabel('Report a staff member')
                .setEmoji('<:discordstaff:923208049961869343>')
                .setStyle('DANGER'),
            )
            .addComponents(
                new MessageButton()
                .setCustomId('other')
                .setLabel('Other')
                .setEmoji('<:DiscordQuestion:923209094687522906>')
                .setStyle('SECONDARY'),
                )

        interaction.reply({
            custom: true,
            content: 'Panel sent',
            ephemeral: true,
        })
        channel.send({embeds: [embed], components: [bt]})
    }
}
