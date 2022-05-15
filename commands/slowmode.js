module.exports = {
    name: 'slowmode',
    description: 'Change a channels slowmode.',
    category: 'Moderation',

    slash: true,
    guildOnly: true,
    
    permissions: ['MANAGE_MESSAGES'],
    options: [
        {
            name: 'channel',
            description: 'The channel to set slowmode to',
            required: true,
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT', 'GUILD_PRIVATE_THREAD', 'GUILD_PUBLIC_THREAD', 'GUILD_NEWS_THREAD'],
        },
        {
            name: 'silent',
            description: 'Whether to show the slowmode change',
            required: true,
            type: 'BOOLEAN',
        },
        {
            name: 'timeout',
            description: 'Slowmode (in seconds)',
            required: true,
            type: 'INTEGER',
        },
    ],

    callback: async ({ interaction, guild }) => {
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
        
        if(!guild) {
            return ('This command can only be run in a server')
        }
        
        const channel = interaction.options.getChannel('channel')
        const timeout = interaction.options.getInteger('timeout')
        const silent = interaction.options.getBoolean('silent')

        if (timeout < 0) {
            return {
                custom: true,
                content: 'Please provide a positive number',
                ephemeral: true,
            }
        } else if (timeout > 21600) {
            interaction.reply ({
                custom: true,
                content: 'Please provide a numer under 21600',
                ephemeral: true,
            })
            
        }

        if (timeout < 21601 && timeout > -1){
            channel.setRateLimitPerUser(timeout)
        if (silent === true) {
            return {
                custom: true,
                content: `Set slowmode to ${timeout} seconds in ${channel}`,
                ephemeral: true,
            }
        } else {
            return {
                custom: true,
                content: `Set slowmode to ${timeout} seconds in ${channel}`
            }
        }
        }
    }

}
