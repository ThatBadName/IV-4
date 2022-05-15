const { MessageEmbed } = require('discord.js')
const ms = require('ms')

    module.exports = {
        name: 'giveaway',
        description: 'Start a giveaway.',
        category: 'Fun',
        slash: true,
        guildOnly: true,
        options: [
            {
                name: 'start',
                description: 'Start a giveaway',
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: 'prize',
                        description: 'The item to giveaway',
                        type: 'STRING',
                        required: true,
                    },
                    {
                        name: 'duration',
                        description: 'The duration of the giveaway',
                        type: 'STRING',
                        required: true,
                    },
                    {
                        name: 'winners',
                        description: 'The amount of winners',
                        type: 'NUMBER',
                        required: true,
                    },
                    {
                        name: 'channel',
                        description: 'The channel in which to hold the giveaway',
                        type: 'CHANNEL',
                        channelTypes: ['GUILD_TEXT', 'GUILD_PRIVATE_THREAD', 'GUILD_PUBLIC_THREAD', 'GUILD_NEWS_THREAD', 'GUILD_NEWS'],
                        required: true,
                    },
                    {
                        name: 'drop',
                        description: 'Whether the giveaway is a drop or not',
                        type: 'BOOLEAN',
                        required: true,
                    },
                    {
                        name: 'bonus-role',
                        description: 'A role that will get bonus entries',
                        type: 'ROLE',
                        required: false,
                    },
                    {
                        name: 'bonus-entries',
                        description: 'The amount of bonus entries they will get',
                        type: 'INTEGER',
                        required: false,
                    },
                ],
            },
            {
                name: 'manage',
                description: 'Manage a giveaway',
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: 'option',
                        description: 'Choose an option',
                        type: 'STRING',
                        choices: [
                            {
                                name: 'reroll',
                                value: 'reroll',
                            },
                            {
                                name: 'end',
                                value: 'end'
                            },
                            {
                                name: 'pause',
                                value: 'pause'
                            },
                            {
                                name: 'unpause',
                                value: 'unpause'
                            },
                            {
                                name: 'delete',
                                value: 'delete',
                            },
                        ],
                        required: true,
                    },
                    {
                        name: 'messageid',
                        description: 'The message ID of the giveaway',
                        type: 'STRING',
                        required: true,
                    },
                ],
            },
        ],
    callback: async({interaction, client}) => {
        const blacklistSchema = require('../models/blacklist-schema')
        const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
        if (blacklist) {
            return
        }
        const maintenanceSchema = require('../models/mantenance-schema')
        const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance && interaction.user.id !== '804265795835265034') {
                return
            } else {
        if (interaction.member.roles.cache.some(role => (role.name === 'Giveaways') )) { // user must have a role named Giveaway to start giveaway
            if (interaction.options.getSubcommand() === 'start') {
                const duration = interaction.options.getString('duration');
                const winnerCount = interaction.options.getNumber('winners');
                const prize = interaction.options.getString('prize');

                client.giveawaysManager.start(interaction.options.getChannel('channel'), {
                    duration: ms(duration),
                    winnerCount,
                    prize,
                    hostedBy: interaction.user,
                    replyToGiveaway: true,
                    isDrop: interaction.options.getBoolean('drop'),
                    endedGiveawaysLifetime: 43200000,
                    embedColor: '#ffbf00',
                    messages: {
                        giveaway: '🎉 **NEW GIVEAWAY!** 🎉',
                        giveawayEnded: '🎉 **GIVEAWAY ENDED** 🎉',
                        drawing: 'Ends {timestamp}',
                    },
                    pauseOptions: {
                        isPaused: false,
                        content: '⚠️ **THIS GIVEAWAY IS PAUSED!** ⚠️',
                        unPauseAfter: null,
                        embedColor: '#FFFF00',
                        infiniteDurationText: '`NEVER`'
                    },
                    lastChance: {
                        enabled: true,
                        content: '⚠️ **LAST CHANCE TO ENTER!** ⚠️',
                        threshold: 120000,
                        embedColor: '#FF0000'
                    },
                })
                interaction.reply({content: 'Giveaway started', ephemeral: true})
            } else {
                if (interaction.options.getString('option') === 'reroll') {
                    const messageId = interaction.options.getString('messageid');
                    client.giveawaysManager.reroll(messageId).then(() => {
                        interaction.channel.send('Success! Giveaway rerolled!');
                    }).catch((err) => {
                        interaction.channel.send(`An error has occurred, please check and try again.\n\`${err}\``);
                    });
                    interaction.reply({content: 'Done!', ephemeral: true})
                } else if (interaction.options.getString('option') === 'delete') {
                    const messageId = interaction.options.getString('messageid');
                    client.giveawaysManager.delete(messageId).then(() => {
                        interaction.channel.send('Success! Giveaway deleted!');
                    }).catch((err) => {
                        interaction.channel.send(`An error has occurred, please check and try again.\n\`${err}\``);
                    });
                    interaction.reply({content: 'Done!', ephemeral: true})
                } else if (interaction.options.getString('option') === 'pause') {
                    const messageId = interaction.options.getString('messageid');
                    client.giveawaysManager.pause(messageId).then(() => {
                        interaction.channel.send('Success! Giveaway paused!');
                    }).catch((err) => {
                        interaction.channel.send(`An error has occurred, please check and try again.\n\`${err}\``);
                    });
                    interaction.reply({content: 'Done!', ephemeral: true})
                } else if (interaction.options.getString('option') === 'unpause') {
                    const messageId = interaction.options.getString('messageid');
                    client.giveawaysManager.unpause(messageId).then(() => {
                        interaction.channel.send('Success! Giveaway unpaused!');
                    }).catch((err) => {
                        interaction.channel.send(`An error has occurred, please check and try again.\n\`${err}\``);
                    });
                    interaction.reply({content: 'Done!', ephemeral: true})
                } else if (interaction.options.getString('option') === 'end') {
                    const messageId = interaction.options.getString('messageid');
                    client.giveawaysManager.end(messageId).then(() => {
                        interaction.channel.send('Success! Giveaway ended!');
                    }).catch((err) => {
                        interaction.channel.send(`An error has occurred, please check and try again.\n\`${err}\``);
                    });
                    interaction.reply({content: 'Done!', ephemeral: true})
                }
            }
            }
        }
}
}
