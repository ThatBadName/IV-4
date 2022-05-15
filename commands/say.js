module.exports = {
    category: 'Dev',
    description: 'Sends a message as the bot',
    slash: true,
    guildOnly: true,
    ownerOnly: true,
    options: [
        {
            name: 'channel',
            description: 'The channel to send the message to',
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT', 'GUILD_PRIVATE_THREAD', 'GUILD_PUBLIC_THREAD', 'GUILD_NEWS_THREAD', 'GUILD_NEWS'],
            required: true,
        },
        {
            name: 'message',
            description: 'The message to send',
            type: 'STRING',
            required: true,
        },
    ],

    callback: ({interaction}) => {
        const channel = interaction.options.getChannel('channel')
        var message = interaction.options.getString('message')
        var message = message.replaceAll("/n/", "\n")

        channel.send(message)
        interaction.reply({
            content: `Message sent in ${channel}`,
            ephemeral: true,
        })
    }
}