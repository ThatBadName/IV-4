const { Client, CommandInteraction } = require("discord.js");
const { DiscordTogether } = require('discord-together');


module.exports = {
    name: "discord-together",
    description: "Discord Together activities",
    category: 'Fun',
    slash: true,
    options: [
        {
            name: "activity",
            description: "select the activity",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "youtube",
                    value: "youtube"
                },
                {
                    name: "chess",
                    value: "chess"
                },
                {
                    name: "betrayal",
                    value: "betrayal"
                },
                {
                    name: "poker",
                    value: "poker"
                },
                {
                    name: "fish",
                    value: "fish"
                },
                {
                    name: "lettertile",
                    value: "lettertile"
                },
                {
                    name: "word_snack",
                    value: "word_snack"
                },
                {
                    name: "doodle_crew",
                    value: "doodle_crew"
                },
                {
                    name: "spell_cast",
                    value: "spell_cast"
                },
                {
                    name: "awkword",
                    value: "awkword"
                },
                {
                    name: "puttparty",
                    value: "puttparty"
                },
            ]

        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    callback: async ({interaction, client}) => {
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
        
        const choices = interaction.options.getString("activity");
        client.discordTogether = new DiscordTogether(client);
        const { options, member, guild, channel } = interaction;

        switch(choices) {
            case "youtube": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({
                    content: "Please connect to a vc to generate your Youtube-together link"
                })
        

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'youtube').then(async invite => {
                    interaction.reply({
                        content: `Press on the link to join the activity! ${invite.code}`
                    })
                })

            }
            break;
            case "chess": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({
                    content: "Please connect to a vc to generate your chess-together link"
                })

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'chess').then(async invite => {
                    interaction.reply({
                        content: `Press on the link to join the activity! ${invite.code}`
                    })
                })

            }
            break;
            case "betrayal": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({
                    content: "Please connect to a vc to generate your betrayal-together link"
                })

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'betrayal').then(async invite => {
                    interaction.reply({
                        content: `Press on the link to join the activity! ${invite.code}`
                    })
                })

            }
            break;
            case "poker": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({
                    content: "Please connect to a vc to generate your poker-together link"
                })

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'poker').then(async invite => {
                    interaction.reply({
                        content: `Press on the link to join the activity! ${invite.code}`
                    })
                })

            }
            break;
            case "fish": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({
                    content: "Please connect to a vc to generate your fishing-together link"
                })

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'fishing').then(async invite => {
                    interaction.reply({
                        content: `Press on the link to join the activity! ${invite.code}`
                    })
                })

            }
            break;
            case "lettertile": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({
                    content: "Please connect to a vc to generate your lettertile-together link"
                })

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'lettertile').then(async invite => {
                    interaction.reply({
                        content: `Press on the link to join the activity! ${invite.code}`
                    })
                })

            }
            break;
            case "word_snack": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({
                    content: "Please connect to a vc to generate your word_snack-together link"
                })

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'wordsnack').then(async invite => {
                    interaction.reply({
                        content: `Press on the link to join the activity! ${invite.code}`
                    })
                })

            }
            break;
            case "doodle_crew": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({
                    content: "Please connect to a vc to generate your doodle_crew-together link"
                })

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'doodlecrew').then(async invite => {
                    interaction.reply({
                        content: `Press on the link to join the activity! ${invite.code}`
                    })
                })

            }
            break;
            case "spell_cast": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({
                    content: "Please connect to a vc to generate your spellcast-together link"
                })

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'spellcast').then(async invite => {
                    interaction.reply({
                        content: `Press on the link to join the activity! ${invite.code}`
                    })
                })

            }
            break;
            case "awkword": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({
                    content: "Please connect to a vc to generate your awkword-together link"
                })

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'awkword').then(async invite => {
                    interaction.reply({
                        content: `Press on the link to join the activity! ${invite.code}`
                    })
                })

            }
            break;
            case "puttparty": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({
                    content: "Please connect to a vc to generate your puttparty-together link"
                })

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'puttparty').then(async invite => {
                    interaction.reply({
                        content: `Press on the link to join the activity! ${invite.code}`
                    })
                })

            }
            break;
            
        }
    }
    },

};