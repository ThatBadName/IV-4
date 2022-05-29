module.exports = {
    category: 'Dev',
    description: 'Sets the bot status',
    expectedArgs: '[presence] [activity] [status]',
    options: [
        {
            name: 'presence',
            description: 'Sets the bot presence',
            required: false,
            type: 'STRING',
            choices: [
                {
                    name: 'Online',
                    description: 'Makes the bot appear Online',
                    value: 'online'
                },
                {
                    name: 'Do Not Disturb',
                    description: 'Makes the bot appear Do Not Disturb',
                    value: 'dnd',
                },
                {
                    name: 'Idle',
                    description: 'Makes the bot appear Idle',
                    value: 'idle',
                },
                {
                    name: 'Offline',
                    description: 'Makes the bot appear Offline',
                    value: 'invisible',
                },
            ],
        },
        {
            name: 'activity',
            description: 'Sets what the bot is doing',
            required: false,
            type: 'STRING',
            choices: [
                {
                    name: 'Playing',
                    description: 'Playing...',
                    value: 'PLAYING',
                },
                {
                    name: 'Watching',
                    description: 'Watching...',
                    value: 'WATCHING'
                },
                {
                    name: 'Listening',
                    description: 'Listening to...',
                    value: 'LISTENING',
                },
                {
                    name: 'Competing',
                    description: 'Competing in...',
                    value: 'COMPETING',
                },
            ],
        },
        {
            name: 'status',
            description: 'Sets the bot status',
            required: false,
            type: 'STRING',
        },
    ],

    slash: true,
    ownerOnly: true,
    testOnly: true,

    callback: async ({ client, interaction, guild }) => {
        const blacklistSchema = require('../models/blacklist-schema')
        const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
        if (blacklist) {
            return
        }
        
        if(!guild) {
            return ('This command can only be run in a server')
        }
        const presence = interaction.options.getString('presence') || 'online'
        const status = interaction.options.getString('status') || ''
        const activity = interaction.options.getString('activity') || 'PLAYING'

        client.user.setActivity(status, { type: activity });
        client.user.setStatus(presence);
        
        return {
            custom: true,
            content: 'Updated status',
            ephemeral: true,
        }
    }
}