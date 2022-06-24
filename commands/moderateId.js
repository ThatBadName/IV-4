const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Modal,
    TextInputComponent
} = require('discord.js');
const ms = require('ms-prettify').default;
const historySchema = require('../models/history-schema')
const strikeSchema = require('../models/strike-schema')
const setupSchema = require('../models/setup-schema')
const punishmentSchema = require('../models/punishment-schema')

module.exports = {
    name: 'moderateid',
    description: 'Moderate a member by their ID',
    category: 'Moderation',
    testOnly: false,
    slash: true,
    permissions: ['MANAGE_GUILD'],
    options: [{
        name: 'id',
        description: 'Provide a user id',
        type: 'STRING',
        required: true,
    }, ],
    /**
     * @param {import(discord.js).CommandInteraction} interaction
     * @param {import(discord.js).Client} client
     */
    callback: async ({
        interaction,
        client
    }) => {
        const blacklistSchema = require('../models/blacklist-schema')
        const blacklist = await blacklistSchema.findOne({
            userId: interaction.user.id
        })
        if (blacklist) {
            return
        }
        const maintenanceSchema = require('../models/mantenance-schema')
        const maintenance = await maintenanceSchema.findOne({
            maintenance: true
        })
        if (maintenance && interaction.user.id !== '804265795835265034') {

            return
        }
        const {
            options,
            guild
        } = interaction;
        const Target = options.getString(`id`);
        let pressed = false

        const result = await setupSchema.findOne({
            guildId: interaction.guild.id
        })
        if (!result) await setupSchema.create({
            guildId: interaction.guild.id
        })
        const logChannel = await guild.channels.cache.find(channel => channel.id === result.logChannelId) || null
        const loggingEnabled = result.loggingEnabled
        if (!logChannel && loggingEnabled === true) return `There is no log channel set. Please set one or disable logging`

        // if(interaction.user.id === Target){
        //     return interaction.reply({
        //         content: "Uhh why would you try to punish yourself",
        //         ephemeral: true,
        //     })
        // }

        const Embed = new MessageEmbed()
            .setColor('0xff3d15')
            .setDescription(
                `
UserID: \`${Target}\``
            )
            .setFooter({
                text: guild.name,
                iconURL: guild.iconURL({
                    dynamic: true
                }),
            })

        let firstBanActionRow;
        let secondBanActionRow;
        let thirdBanActionRow

        let BanModel = new Modal()
            .setTitle(`Ban - ${Target}`)
            .setCustomId(`model-ban`);


        const ban_reason = new TextInputComponent()
            .setCustomId('ban-reason')
            .setLabel("Why are you banning this user?")
            .setStyle('PARAGRAPH')
            .setRequired(false);

        firstBanActionRow = new MessageActionRow().addComponents(ban_reason);
        BanModel.addComponents(firstBanActionRow);

        let TempbanModel = new Modal()
            .setTitle(`Tempban - ${Target}`)
            .setCustomId('model-tempban')

        const ban_duration = new TextInputComponent()
            .setLabel("Provide Duration")
            .setCustomId('tempban_duration')
            .setPlaceholder('1m, 1h, 1d')
            .setRequired(true)
            .setStyle('SHORT');

        const banReason = new TextInputComponent()
            .setCustomId('ban_reason')
            .setLabel("Why are you banning this user?")
            .setStyle('PARAGRAPH')
            .setRequired(false);

        thirdBanActionRow = new MessageActionRow().addComponents(ban_duration)
        firstBanActionRow = new MessageActionRow().addComponents(banReason)
        TempbanModel.addComponents(thirdBanActionRow, firstBanActionRow)

        let StrikeAddModel = new Modal()
            .setTitle(`Strike - ${Target}`)
            .setCustomId('model-strike-add')

        const strikeReason = new TextInputComponent()
            .setCustomId('strike-reason')
            .setLabel('Why are you striking this user?')
            .setRequired(true)
            .setStyle('PARAGRAPH')

        firstBanActionRow = new MessageActionRow().addComponents(strikeReason)
        StrikeAddModel.addComponents(firstBanActionRow)

        let StrikeRemoveModel = new Modal()
            .setTitle(`Strike Remove - ${Target}`)
            .setCustomId('model-strike-add')

        const strikeId = new TextInputComponent()
            .setCustomId('strike-id')
            .setLabel('The ID of the strike to remove')
            .setRequired(true)
            .setStyle('SHORT')

        firstBanActionRow = new MessageActionRow().addComponents(strikeId)
        StrikeRemoveModel.addComponents(firstBanActionRow)

        const Actions = new MessageActionRow()
        const Actions2 = new MessageActionRow()
        const Actions3 = new MessageActionRow().addComponents(new MessageButton().setCustomId('cancelMod').setLabel('Cancel').setStyle('SECONDARY'))
        Actions2.addComponents(

            new MessageButton()
            .setCustomId('moderate-remove-strike')
            .setLabel('Remove Strike')
            .setStyle('SUCCESS'),

            new MessageButton()
            .setCustomId('moderate-history')
            .setStyle('PRIMARY')
            .setLabel('History'),
        )
            Actions.addComponents(
                new MessageButton()
                .setCustomId('moderate-ban')
                .setStyle('DANGER')
                .setLabel('Ban'),
                new MessageButton()
                .setCustomId('moderate-tempban')
                .setStyle('DANGER')
                .setLabel('Tempban'),
            )
        Actions.addComponents(
            new MessageButton()
            .setCustomId('moderate-add-strike')
            .setLabel('Add Strike')
            .setStyle('DANGER'),
        )

        const panelMessage = await interaction.reply({
            embeds: [Embed],
            components: [Actions, Actions2, Actions3],
            content: `User ID: ${Target}`,
            fetchReply: true,
        });
        const collector = await panelMessage.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 30000
        });

        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id)
                return i.reply({
                    content: 'You are not owner of this button!',
                    ephemeral: true,
                });

            const thing = i.customId
            try {
                if (thing === 'moderate-ban') {

                    i.showModal(BanModel);
                    i.awaitModalSubmit({
                            time: 60000
                        }).catch(() => {
                            Actions.components[0].setDisabled(true)
                            Actions.components[1].setDisabled(true)
                            Actions.components[2].setDisabled(true)
                            
                            
                            Actions2.components[0].setDisabled(true)
                            Actions2.components[1].setDisabled(true)
                            
                            Actions3.components[0].setDisabled(true)
                            
                            
                            panelMessage.edit({
                                content: 'Timed Out',
                                components: [Actions, Actions2],
                            })
                            return
                        })
                        .then(async (interact) => {
                            if (!interact.member.permissions.has('BAN_MEMBERS'))
                                return interact.reply({
                                    content: 'Get perms to do this',
                                    ephemeral: true,
                                });
                            if (interact.user.id === Target) {
                                return interact.reply({
                                    content: 'Get perms to do this',
                                    ephemeral: true,
                                });
                            }
                            let Reason = interact.fields.getTextInputValue('ban-reason') || 'No reason provided';


                            interact.reply({
                                embeds: [
                                    new MessageEmbed()
                                    .setTitle('User Banned')
                                    .setFooter({
                                        text: `Banned by: ${interact.user.tag}`,
                                        iconURL: interact.user.displayAvatarURL(),
                                    })
                                    .setColor('0xff3d15')
                                    .setDescription(`${Target} has been banned`)
                                    .addField(
                                        'Reason:',
                                        Reason,
                                        false,
                                    )
                                ]
                            })
                            historySchema.create({
                                userId: Target,
                                staffId: interact.user.id,
                                guildId: guild?.id,
                                reason: Reason,
                                type: 'ban',
                                duration: 'Eternal'
                            })
                            const embed = new MessageEmbed()
                                .setColor('DARK_RED')
                                .setTitle(`**You have been banned**`)
                                .addField("Server:", `${guild}`)
                                .addField("Reason:", `${Reason}`)
                                .addField("Duration:", '\`Eternal\`')
                                

                            const logEmbed = new MessageEmbed()
                                .setColor('RED')
                                .setTitle('BAN')
                                .setDescription(`${Target} has been banned`)
                                .addField("Staff:", `${interact.user}`)
                                .addField("Reason:", `${Reason}`)
                                .addField("Duration:", '\`Eternal\`')

                            guild.members.ban(Target, {
                                reason: `${Reason} - ${interact.user.tag}`,
                            });

                            Actions.components[0].setDisabled(true)
                            Actions.components[1].setDisabled(true)
                            Actions.components[2].setDisabled(true)
                            
                            

                            Actions2.components[0].setDisabled(true)
                            Actions2.components[1].setDisabled(true)
                            
                            
                            



                            panelMessage.edit({
                                content: 'Action Taken',
                                components: [Actions, Actions2],
                            })
                            pressed = true
                            if (logChannel !== null) logChannel.send({
                                embeds: [logEmbed]
                            })
                        })
                } else if (thing === 'moderate-add-strike') {
                    i.showModal(StrikeAddModel)
                    i.awaitModalSubmit({
                            time: 60000
                        }).catch(() => {
                            Actions.components[0].setDisabled(true)
                            Actions.components[1].setDisabled(true)
                            Actions.components[2].setDisabled(true)
                            
                            
                            Actions2.components[0].setDisabled(true)
                            Actions2.components[1].setDisabled(true)
                            
                            Actions3.components[0].setDisabled(true)
                            
                            
                            panelMessage.edit({
                                content: 'Timed Out',
                                components: [Actions, Actions2],
                            })
                            return
                        })
                        .then(async (interact) => {
                            const staff = interact.user
                            const reason = interact.fields.getTextInputValue('strike-reason')

                            const strike = await strikeSchema.create({
                                userId: Target,
                                staffId: staff.id,
                                guildId: guild?.id,
                                reason,
                            })
                            historySchema.create({
                                userId: Target,
                                staffId: staff.id,
                                guildId: guild?.id,
                                reason,
                                punishmentId: strike.id,
                                type: 'strike',
                            })

                            const logEmbed = new MessageEmbed()
                                .setColor('PURPLE')
                                .setTitle('STRIKE ADD')
                                .setDescription(`${Target} has been stricken`)
                                .addField("Staff:", `${staff}`)
                                .addField("Reason:", `${reason}`)
                                .addField("ID:", `\`${strike.id}\``)

                            const embed = new MessageEmbed()
                                .setColor('DARK_RED')
                                .setTitle(`**You have been stricken**`)
                                .addField("Server:", `${guild}`)
                                .addField("Reason:", `${reason}`)
                                .addField("ID:", `\`${strike.id}\``)
                                
                                .setFooter({
                                    text: 'To view all strikes do \'/liststrikes\''
                                })

                            interact.reply({
                                embeds: [
                                    new MessageEmbed()
                                    .setTitle('User stricken')
                                    .setAuthor({
                                        name: `${Target.user.tag}`,
                                        iconURL: Target.user.displayAvatarURL(),
                                    })
                                    .setFooter({
                                        text: `Stricken by: ${interact.user.tag}`,
                                        iconURL: interact.user.displayAvatarURL(),
                                    })
                                    .setColor('0xff3d15')
                                    .setDescription(`${Target} has been stricken\n**ID**: \`${strike.id}\``)
                                    .addField(
                                        'Reason:',
                                        reason,
                                        false,
                                    )
                                ]
                            })
                            Actions.components[0].setDisabled(true)
                            Actions.components[1].setDisabled(true)
                            Actions.components[2].setDisabled(true)
                            
                            
                            Actions2.components[0].setDisabled(true)
                            Actions2.components[1].setDisabled(true)
                            
                            
                            


                            panelMessage.edit({
                                content: 'Action Taken',
                                components: [Actions, Actions2],
                            })
                            pressed = true
                            if (logChannel !== null) logChannel.send({
                                embeds: [logEmbed]
                            })

                        })
                } else if (thing === 'moderate-history') {
                    panelMessage.edit({
                        embeds: [
                            new MessageEmbed()
                            .setTitle('Please check your DMs')
                            .setColor('0xff3d15')
                        ],
                        components: []
                    })
                    const rows = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                            .setCustomId('strikes')
                            .setLabel('Strikes')
                            .setDisabled(false)
                            .setStyle('PRIMARY'),

                            new MessageButton()
                            .setCustomId('timeouts')
                            .setLabel('Timeouts')
                            .setDisabled(false)
                            .setStyle('PRIMARY'),

                            new MessageButton()
                            .setCustomId('kicks')
                            .setLabel('Kicks')
                            .setDisabled(false)
                            .setStyle('PRIMARY'),

                            new MessageButton()
                            .setCustomId('bans')
                            .setLabel('Bans')
                            .setDisabled(false)
                            .setStyle('PRIMARY'),

                        )
                    const pageButtons = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                            .setCustomId('firstPage')
                            .setEmoji('⏪')
                            .setDisabled(true)
                            .setStyle('SECONDARY'),

                            new MessageButton()
                            .setCustomId('backPage')
                            .setEmoji('◀️')
                            .setDisabled(true)
                            .setStyle('SECONDARY'),

                            new MessageButton()
                            .setCustomId('nextPage')
                            .setEmoji('▶️')
                            .setStyle('SECONDARY'),

                            new MessageButton()
                            .setCustomId('lastPage')
                            .setEmoji('⏩')
                            .setStyle('SECONDARY'),
                        )

                        const messageSendStart = await interaction.member.send({embeds: [new MessageEmbed().setTitle('Please choose the type of punishment to view').setColor('BLURPLE')], components: [rows]})

                        //! finding strikes
                        let currentDisplay = 'none'
                        let currentPage = 0
                        const findStrikes = await historySchema.find({
                            userId: Target,
                            guildId: guild.id,
                            type: 'strike'
                        })
                        //! Finding timeouts
                        const findTimeouts = await historySchema.find({
                            userId: Target,
                            guildId: guild.id,
                            type: 'timeout'
                        })
                        //! Finding kicks
                        const findKicks = await historySchema.find({
                            userId: Target,
                            guildId: guild.id,
                            type: 'kick'
                        })
                        //! Finding bans
                        const findBans = await historySchema.find({
                            userId: Target,
                            guildId: guild.id,
                            type: 'ban'
                        })

                        const strikeEmbeds = generatePagesStrikes(findStrikes)
                        const timeoutEmbeds = generatePagesTimeouts(findTimeouts)
                        const kickEmbeds = generatePagesKicks(findKicks)
                        const banEmbeds = generatePagesBans(findBans)
                        

    
                        

                        const pageButtonCollector = await messageSendStart.createMessageComponentCollector({
                            componentType: 'BUTTON',
                            time: 30000
                        })

                        pageButtonCollector.on('collect', async (i) => {
                            if (i.customId === 'backPage') {

                                if (currentDisplay === 'strikes') {
                                    if (currentPage !== 0) {
                                        --currentPage
                                        if (currentPage === 0) {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(true)
                                            pageButtons.components[1].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${strikeEmbeds.length}\``,
                                            embeds: [strikeEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                } else if (currentDisplay === 'timeouts') {
                                    if (currentPage !== 0) {
                                        --currentPage
                                        if (currentPage === 0) {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(true)
                                            pageButtons.components[1].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${timeoutEmbeds.length}\``,
                                            embeds: [timeoutEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                } else if (currentDisplay === 'kicks') {
                                    if (currentPage !== 0) {
                                        --currentPage
                                        if (currentPage === 0) {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(true)
                                            pageButtons.components[1].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${kickEmbeds.length}\``,
                                            embeds: [kickEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                } else if (currentDisplay === 'bans') {
                                    if (currentPage !== 0) {
                                        --currentPage
                                        if (currentPage === 0) {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(true)
                                            pageButtons.components[1].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${banEmbeds.length}\``,
                                            embeds: [banEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                }
                            } else if (i.customId === 'nextPage') {
                                if (currentDisplay === 'strikes') {
                                    if (currentPage + 1 !==  strikeEmbeds.length) {
                                        currentPage++
                                        if (currentPage + 1 === strikeEmbeds.length) {
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                            pageButtons.components[2].setDisabled(true)
                                            pageButtons.components[3].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${strikeEmbeds.length}\``,
                                            embeds: [strikeEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                } else if (currentDisplay === 'timeouts') {
                                    if (currentPage + 1 !==  timeoutEmbeds.length) {
                                        currentPage++
                                        if (currentPage + 1 === strikeEmbeds.length) {
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                            pageButtons.components[2].setDisabled(true)
                                            pageButtons.components[3].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${timeoutEmbeds.length}\``,
                                            embeds: [timeoutEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                } else if (currentDisplay === 'kicks') {
                                    if (currentPage + 1 !==  kickEmbeds.length) {
                                        currentPage++
                                        if (currentPage + 1 === strikeEmbeds.length) {
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                            pageButtons.components[2].setDisabled(true)
                                            pageButtons.components[3].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${kickEmbeds.length}\``,
                                            embeds: [kickEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                } else if (currentDisplay === 'bans') {
                                    if (currentPage + 1 !==  banEmbeds.length) {
                                        currentPage++
                                        if (currentPage + 1 === strikeEmbeds.length) {
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                            pageButtons.components[2].setDisabled(true)
                                            pageButtons.components[3].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${banEmbeds.length}\``,
                                            embeds: [banEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                }
                            } else if (i.customId === 'lastPage') { //!
                                if (currentDisplay === 'strikes') {
                                    if (currentPage + 1 !==  strikeEmbeds.length) {
                                        currentPage = strikeEmbeds.length - 1
                                        if (currentPage + 1 === strikeEmbeds.length) {
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                            pageButtons.components[2].setDisabled(true)
                                            pageButtons.components[3].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${strikeEmbeds.length}\``,
                                            embeds: [strikeEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                } else if (currentDisplay === 'timeouts') {
                                    if (currentPage + 1 !== timeoutEmbeds.length) {
                                        currentPage = timeoutEmbeds.length - 1
                                        if (currentPage + 1 === strikeEmbeds.length) {
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                            pageButtons.components[2].setDisabled(true)
                                            pageButtons.components[3].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${timeoutEmbeds.length}\``,
                                            embeds: [timeoutEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                } else if (currentDisplay === 'kicks') {
                                    if (currentPage + 1 !==  kickEmbeds.length) {
                                        currentPage = kickEmbeds.length - 1
                                        if (currentPage + 1 === strikeEmbeds.length) {
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                            pageButtons.components[2].setDisabled(true)
                                            pageButtons.components[3].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${kickEmbeds.length}\``,
                                            embeds: [kickEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                } else if (currentDisplay === 'bans') {
                                    if (currentPage + 1 !== banEmbeds.length) {
                                        currentPage = banEmbeds.length - 1
                                        if (currentPage + 1 === strikeEmbeds.length) {
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                            pageButtons.components[2].setDisabled(true)
                                            pageButtons.components[3].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${banEmbeds.length}\``,
                                            embeds: [banEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                }
                            } else if (i.customId === 'firstPage') { //!
                                if (currentDisplay === 'strikes') {
                                    if (currentPage !== 0) {
                                        currentPage = 0
                                        if (currentPage === 0) {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(true)
                                            pageButtons.components[1].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${strikeEmbeds.length}\``,
                                            embeds: [strikeEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                } else if (currentDisplay === 'timeouts') {
                                    if (currentPage !== 0) {
                                        currentPage = 0
                                        if (currentPage === 0) {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(true)
                                            pageButtons.components[1].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${timeoutEmbeds.length}\``,
                                            embeds: [timeoutEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                } else if (currentDisplay === 'kicks') {
                                    if (currentPage !== 0) {
                                        currentPage = 0
                                        if (currentPage === 0) {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(true)
                                            pageButtons.components[1].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${kickEmbeds.length}\``,
                                            embeds: [kickEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                } else if (currentDisplay === 'bans') {
                                    if (currentPage !== 0) {
                                        currentPage = 0
                                        if (currentPage === 0) {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(true)
                                            pageButtons.components[1].setDisabled(true)
                                        } else {
                                            pageButtons.components[2].setDisabled(false)
                                            pageButtons.components[3].setDisabled(false)
                                            pageButtons.components[0].setDisabled(false)
                                            pageButtons.components[1].setDisabled(false)
                                        }
                                        messageSendStart.edit({
                                            content: `Current Page: \`${currentPage + 1}/${banEmbeds.length}\``,
                                            embeds: [banEmbeds[currentPage]],
                                            components: [rows, pageButtons]
                                        })
                                        i.deferUpdate()
                                        pageButtonCollector.resetTimer()
                                    } else i.reply({
                                        content: `There are no more pages`,
                                        ephemeral: true,
                                    })
                                }
                            }
                            else if (i.customId === 'strikes') {
                                if (strikeEmbeds.length !== 0) {
                                    if (currentDisplay !== 'strikes') currentPage = 0
                                    currentDisplay = 'strikes',
                                    pageButtonCollector.resetTimer()
                                    i.deferUpdate()
                                    rows.components[0].setDisabled(true)
                                    rows.components[1].setDisabled(false)
                                    rows.components[2].setDisabled(false)
                                    rows.components[3].setDisabled(false)
                                    pageButtons.components[0].setDisabled(true)
                                    pageButtons.components[1].setDisabled(true)
                                    pageButtons.components[2].setDisabled(false)
                                    pageButtons.components[3].setDisabled(false)
                                    messageSendStart.edit({embeds: [strikeEmbeds[currentPage]], components: [rows, pageButtons], content: `Current Page: \`${currentPage + 1}/${strikeEmbeds.length}\``}).catch((err) => {i.reply({content: 'This user does not have any strikes', ephemeral: true})})
                                } else i.reply({content: 'This user does not have any strikes', ephemeral: true})
                            } else if (i.customId === 'timeouts') {
                                if (timeoutEmbeds.length !== 0) {
                                    if (currentDisplay !== 'timeouts') currentPage = 0
                                    currentDisplay = 'timeouts',
                                    pageButtonCollector.resetTimer()
                                    i.deferUpdate()
                                    rows.components[0].setDisabled(false)
                                    rows.components[1].setDisabled(true)
                                    rows.components[2].setDisabled(false)
                                    rows.components[3].setDisabled(false)
                                    pageButtons.components[0].setDisabled(true)
                                    pageButtons.components[1].setDisabled(true)
                                    pageButtons.components[2].setDisabled(false)
                                    pageButtons.components[3].setDisabled(false)
                                    messageSendStart.edit({embeds: [timeoutEmbeds[currentPage]], components: [rows, pageButtons], content: `Current Page: \`${currentPage + 1}/${timeoutEmbeds.length}\``}).catch((err) => {i.reply({content: 'This user does not have any timeouts', ephemeral: true})})
                                } else i.reply({content: 'This user does not have any timeouts', ephemeral: true})
                            } else if (i.customId === 'kicks') {
                                if (kickEmbeds.length !== 0) {
                                    if (currentDisplay !== 'kicks') currentPage = 0
                                    currentDisplay = 'kicks',
                                    pageButtonCollector.resetTimer()
                                    i.deferUpdate()
                                    rows.components[0].setDisabled(false)
                                    rows.components[1].setDisabled(false)
                                    rows.components[2].setDisabled(true)
                                    rows.components[3].setDisabled(false)
                                    pageButtons.components[0].setDisabled(true)
                                    pageButtons.components[1].setDisabled(true)
                                    pageButtons.components[2].setDisabled(false)
                                    pageButtons.components[3].setDisabled(false)
                                    messageSendStart.edit({embeds: [kickEmbeds[currentPage]], components: [rows, pageButtons], content: `Current Page: \`${currentPage + 1}/${kickEmbeds.length}\``}).catch((err) => {i.reply({content: 'This user does not have any kicks', ephemeral: true})})
                                } else i.reply({content: 'This user does not have any kicks', ephemeral: true})
                            } else if (i.customId === 'bans') {
                                if (banEmbeds.length !== 0) {
                                    if (currentDisplay !== 'bans') currentPage = 0
                                    currentDisplay = 'bans',
                                    pageButtonCollector.resetTimer()
                                    i.deferUpdate()
                                    rows.components[0].setDisabled(false)
                                    rows.components[1].setDisabled(false)
                                    rows.components[2].setDisabled(false)
                                    rows.components[3].setDisabled(true)
                                    pageButtons.components[0].setDisabled(true)
                                    pageButtons.components[1].setDisabled(true)
                                    pageButtons.components[2].setDisabled(false)
                                    pageButtons.components[3].setDisabled(false)
                                    messageSendStart.edit({embeds: [banEmbeds[currentPage]], components: [rows, pageButtons], content: `Current Page: \`${currentPage + 1}/${banEmbeds.length}\``}).catch((err) => {i.reply({content: 'This user does not have any bans', ephemeral: true})})
                                } else i.reply({content: 'This user does not have any bans', ephemeral: true})
                            }
                        })
                        pageButtonCollector.on('end', i => {
                            messageSendStart.edit({content: `Panel timed out`, components: []})
                        })


                    function generatePagesStrikes(strikes) {
                        const strikeEmbeds = []
                        let k = 5
                        for (let i = 0; i < strikes.length; i += 5) {
                            const current = strikes.slice(i, k)
                            let j = i
                            k += 5
                            let info = `No Strikes Logged`
                            info = current.map(strike => `**ID**: \`${strike._id}\`\n**Staff**: <@${strike.staffId}> (\`${strike.staffId}\`)\n**Date**: <t:${Math.round(strike.createdAt.getTime() / 1000)}>\n**Reason**: ${strike.reason}`).join('\n\n')
                            const embed = new MessageEmbed()
                                .setColor('RANDOM')
                                .setTitle('Strike List')
                                .setDescription(info)
                            strikeEmbeds.push(embed)
                        }
                        return strikeEmbeds

                    }
                    function generatePagesTimeouts(timeouts) {
                        const timeoutEmbeds = []
                        let k = 5
                        for (let i = 0; i < timeouts.length; i += 5) {
                            const current = timeouts.slice(i, k)
                            let j = i
                            k += 5
                            let info = `No Timeouts Logged`
                            info = current.map(timeout => `**Duration**: \`${timeout.duration}\`\n**Staff**: <@${timeout.staffId}> (\`${timeout.staffId}\`)\n**Date**: <t:${Math.round(timeout.createdAt.getTime() / 1000)}>\n**Reason**: ${timeout.reason}`).join('\n\n')
                            const embed = new MessageEmbed()
                                .setColor('RANDOM')
                                .setTitle('Timeout List')
                                .setDescription(info)
                            timeoutEmbeds.push(embed)
                        }
                        return timeoutEmbeds

                    }
                    function generatePagesKicks(kicks) {
                        const kickEmbeds = []
                        let k = 5
                        for (let i = 0; i < kicks.length; i += 5) {
                            const current = kicks.slice(i, k)
                            let j = i
                            k += 5
                            let info = `No Kicks Logged`
                            info = current.map(kick => `**Staff**: <@${kick.staffId}> (\`${kick.staffId}\`)\n**Date**: <t:${Math.round(kick.createdAt.getTime() / 1000)}>\n**Reason**: ${kick.reason}`).join('\n\n')
                            const embed = new MessageEmbed()
                                .setColor('RANDOM')
                                .setTitle('Kick List')
                                .setDescription(info)
                            kickEmbeds.push(embed)
                        }
                        return kickEmbeds

                    }
                    function generatePagesBans(bans) {
                        const banEmbeds = []
                        let k = 5
                        for (let i = 0; i < bans.length; i += 5) {
                            const current = bans.slice(i, k)
                            let j = i
                            k += 5
                            let info = `No Bans Logged`
                            info = current.map(ban => `**Staff**: <@${strike.staffId}> (\`${strike.staffId}\`)\n**Duration**: \`${ban.duration}\`\n**Date**: <t:${Math.round(ban.createdAt.getTime() / 1000)}>\n**Reason**: ${ban.reason}`).join('\n\n')
                            const embed = new MessageEmbed()
                                .setColor('RANDOM')
                                .setTitle('Ban List')
                                .setDescription(info)
                            banEmbeds.push(embed)
                        }
                        return banEmbeds

                    }
                } else if (thing === 'cancelMod') {
                    panelMessage.delete()
                    pressed = true
                } else if (thing === 'moderate-remove-strike') {
                    i.showModal(StrikeRemoveModel)
                    i.awaitModalSubmit({
                            time: 60000
                        }).catch(() => {
                            Actions.components[0].setDisabled(true)
                            Actions.components[1].setDisabled(true)
                            Actions.components[2].setDisabled(true)
                            
                            
                            Actions2.components[0].setDisabled(true)
                            Actions2.components[1].setDisabled(true)
                            
                            Actions3.components[0].setDisabled(true)
                            
                            
                            panelMessage.edit({
                                content: 'Timed Out',
                                components: [Actions, Actions2],
                            })
                            return
                        })
                        .then(async (interact) => {
                            const staff = interact.user
                            const strikeId = interact.fields.getTextInputValue('strike-id')

                            try {
                                const strike = await strikeSchema.findOneAndDelete({
                                    id: strikeId,
                                    guildId: interaction.guild.id,
                                    userId: Target
                                })

                                interact.reply({
                                    embeds: [
                                        new MessageEmbed()
                                        .setTitle('Strike Removed')
                                        .setFooter({
                                            text: `By: ${interact.user.tag}`,
                                            iconURL: interact.user.displayAvatarURL(),
                                        })
                                        .setColor('0xff3d15')
                                        .setDescription(`${Target} has had a strike deleted`)
                                    ]
                                })

                                const logEmbed = new MessageEmbed()
                                    .setColor('PURPLE')
                                    .setTitle('STRIKE REMOVE')
                                    .setDescription(`${Target} has had a strike removed`)
                                    .addField("Staff:", `${interact.user}`)
                                    .addField("ID:", `\`${strike.id}\``)


                                const embed = new MessageEmbed()
                                    .setColor('DARK_RED')
                                    .setTitle(`**You have had a strike removed**`)
                                    .addField("Server:", `${guild}`)
                                    .addField("ID:", `\`${strike.id}\``)

                                Actions.components[0].setDisabled(true)
                                Actions.components[1].setDisabled(true)
                                Actions.components[2].setDisabled(true)
                                
                                
                                Actions2.components[0].setDisabled(true)
                                Actions2.components[1].setDisabled(true)
                                
                                Actions3.components[0].setDisabled(true)
                                
                                


                                panelMessage.edit({
                                    content: 'Action Taken',
                                    components: [Actions, Actions2],
                                })
                                pressed = true
                                if (logChannel !== null) logChannel.send({
                                    embeds: [logEmbed]
                                })
                            } catch (err) {
                                console.log(err)
                                interact.reply({
                                    embeds: [new MessageEmbed().setColor('0xff0000').setTitle('I could not find a strike with that ID')]
                                })
                                Actions.components[0].setDisabled(true)
                                Actions.components[1].setDisabled(true)
                                Actions.components[2].setDisabled(true)
                                
                                
                                Actions2.components[0].setDisabled(true)
                                Actions2.components[1].setDisabled(true)
                                
                                Actions3.components[0].setDisabled(true)
                                
                                



                                panelMessage.edit({
                                    content: 'Action Taken',
                                    components: [Actions, Actions2],
                                })
                            }
                        })
                } else if (thing === 'moderate-tempban') {
                    i.showModal(TempbanModel)
                    i.awaitModalSubmit({
                            time: 60000
                        }).catch(() => {
                            Actions.components[0].setDisabled(true)
                            Actions.components[1].setDisabled(true)
                            Actions.components[2].setDisabled(true)
                            
                            
                            Actions2.components[0].setDisabled(true)
                            Actions2.components[1].setDisabled(true)
                            
                            Actions3.components[0].setDisabled(true)
                            
                            
                            panelMessage.edit({
                                content: 'Timed Out',
                                components: [Actions, Actions2],
                            })
                            return
                        })
                        .then(async (interact) => {
                            if (!interact.member.permissions.has('BAN_MEMBERS'))
                                return interact.reply({
                                    content: 'Get perms to do this',
                                    ephemeral: true,
                                });
                            if (interact.user.id === Target) {
                                return interact.reply({
                                    content: 'Get perms to do this',
                                    ephemeral: true,
                                });
                            }
                            let Reason = interact.fields.getTextInputValue('ban_reason') || 'No reason provided';

                            const banDuration = interact.fields.getTextInputValue('tempban_duration')

                            userId = Target

                            let time
                            let type
                            try {
                                const split = banDuration.match(/\d+|\D+/g)
                                time = parseInt(split[0])
                                type = split[1].toLowerCase()

                            } catch (e) {
                                return interact.reply({
                                    content: "Invalid time format. Example format: \"10d\" where 'd' = days, 'h = hours and 'm' = minutes",
                                    ephemeral: true
                                })
                            }

                            if (type === 'h') {
                                time *= 60
                            } else if (type === 'd') {
                                time *= 60 * 24
                            } else if (type !== 'm') {
                                return interact.reply({
                                    content: 'Please use "m" (minutes), "h" (hours), "d" (days)',
                                    ephemeral: true
                                })
                            }

                            const expires = new Date()
                            expires.setMinutes(expires.getMinutes() + time)

                            const result = await punishmentSchema.findOne({
                                guildId: guild.id,
                                userId,
                                type: 'ban',
                            })
                            const banList = await interaction.guild.bans.fetch(userId).catch(() => {})
                            if (banList) {
                                return interact.reply({
                                    content: `<@${userId}> is already banned`,
                                    ephemeral: true
                                })
                            } else if (result && !banList) result.delete()

                            historySchema.create({
                                userId: Target,
                                staffId: interact.user.id,
                                guildId: guild?.id,
                                reason: Reason,
                                banDuration,
                                type: 'ban',
                            })

                            const database = await setupSchema.findOne({
                                guildId: guild.id
                            })

                            const logEmbed = new MessageEmbed()
                                .setColor('FUCHSIA')
                                .setTitle('TEMPBAN')
                                .setDescription(`${Target} has been temp-banned`)
                                .addField("Staff:", `${interact.user}`)
                                .addField("Reason:", `${Reason}`)
                                .addField("Duration:", `\`${banDuration}\``)
                                .addField("Expires", `${expires}`)

                            const embed = new MessageEmbed()
                                .setColor('DARK_RED')
                                .setTitle(`**You have been temporarily banned**`)
                                .addField("Server:", `${guild}`)
                                .addField("Reason:", `${Reason}`)
                                .addField("Duration:", `\`${banDuration}\``)
                                .addField("Expires", `${expires}`)
                                


                            try {
                                await guild.members.ban(userId, {
                                    Reason,
                                })

                                await new punishmentSchema({
                                    userId,
                                    guildId: guild.id,
                                    staffId: interact.user.id,
                                    reason: Reason,
                                    expires,
                                    type: 'ban',
                                }).save()
                            } catch (ignored) {
                                return interact.reply({
                                    content: `Cannot ban that user`,
                                    ephemeral: true
                                })
                            }
                            Actions.components[0].setDisabled(true)
                            Actions.components[1].setDisabled(true)
                            Actions.components[2].setDisabled(true)
                            
                            
                            Actions2.components[0].setDisabled(true)
                            Actions2.components[1].setDisabled(true)
                            
                            Actions3.components[0].setDisabled(true)
                            
                            


                            interact.reply({
                                embeds: [
                                    new MessageEmbed()
                                    .setTitle('User Tempbanned')
                                    .setFooter({
                                        text: `By: ${interact.user.tag}`,
                                        iconURL: interact.user.displayAvatarURL(),
                                    })
                                    .setColor('0xff3d15')
                                    .setDescription(`${Target} has been banned for \`${banDuration}\``)
                                ]
                            })


                            panelMessage.edit({
                                content: 'Action Taken',
                                components: [Actions, Actions2],
                            })
                            logChannel.send({
                                embeds: [logEmbed]
                            })

                        })
                    }
            } catch (err) {
                interaction.reply({
                    embeds: [new MessageEmbed().setTitle('There was an unexpected error while processing your request').setColor('RED')]
                })
                console.log(err)
            }
        })

        collector.on('end', async collected => {
            if (collected.size === 0) {
                Actions.components[0].setDisabled(true)
                Actions.components[1].setDisabled(true)
                Actions.components[2].setDisabled(true)
                
                
                Actions2.components[0].setDisabled(true)
                Actions2.components[1].setDisabled(true)
                
                Actions3.components[0].setDisabled(true)
                
                


                panelMessage.edit({
                    components: [Actions, Actions2, Actions3]
                })
            }
        })
    }
}