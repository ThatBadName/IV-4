const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, InteractionWebhook } = require("discord.js");
const DB = require('../models/poll-schema');

module.exports = {
    name: "poll",
    description: "Create a poll",
    category: 'Fun',
    slash: true,
    cooldown: "3s",
    guildOnly: true,
    expectedArgs: '<type>',
    options: [
        {
            name: "create",
            description: "Create a poll",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "title",
                    description: "Give a name for the poll",
                    type: "STRING",
                    required: true
                },
                {
                    name: "choice1",
                    description: "What is the first choice for the poll",
                    type: "STRING",
                    required: true
                },
                {
                    name: "choice2",
                    description: "What is the second choice for the poll",
                    type: "STRING",
                    required: true
                },
                {
                    name: "choice3",
                    description: "What is the third choice for the poll",
                    type: "STRING"
                },
                {
                    name: "choice4",
                    description: "What is the fourth choice for the poll",
                    type: "STRING"
                },
                {
                    name: "choice5",
                    description: "What is the fifth choice for the poll",
                    type: "STRING"
                }
            ]
        },
        {
            name: "results",
            description: "Show the results of a poll",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "message_id",
                    description: "Provide the messageID of the poll",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "end",
            description: "End a poll",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "message_id",
                    description: "Provide the messageID of the poll",
                    type: "STRING",
                    required: true
                }
            ]
        }
    ],
       callback: async({interaction, user, channel, guild}) => {
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
        
        const SubCommand = interaction.options.getSubcommand();

        switch (SubCommand) {
            case "create": {
                const Title = interaction.options.getString("title");
                const Choice1 = interaction.options.getString("choice1");
                const Choice2 = interaction.options.getString("choice2");
                const Choice3 = interaction.options.getString("choice3");
                const Choice4 = interaction.options.getString("choice4");
                const Choice5 = interaction.options.getString("choice5");

                let Choices = [`1️⃣ ${Choice1}`, `2️⃣ ${Choice2}`];
                const Row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("1️⃣")
                            .setStyle("SECONDARY")
                            .setLabel('0')
                            .setEmoji("1️⃣"),
                        new MessageButton()
                            .setCustomId("2️⃣")
                            .setStyle("SECONDARY")
                            .setLabel('0')
                            .setEmoji("2️⃣")
                    )

                if (Choice3) {
                    Choices.push(`3️⃣ ${Choice3}`);
                    Row.addComponents(
                        new MessageButton()
                            .setCustomId("3️⃣")
                            .setStyle("SECONDARY")
                            .setLabel('0')
                            .setEmoji("3️⃣")
                    )
                }
                if (Choice4) {
                    Choices.push(`4️⃣ ${Choice4}`);
                    Row.addComponents(
                        new MessageButton()
                            .setCustomId("4️⃣")
                            .setStyle("SECONDARY")
                            .setLabel('0')
                            .setEmoji("4️⃣")
                    )
                }
                if (Choice5) {
                    Choices.push(`5️⃣ ${Choice5}`);
                    Row.addComponents(
                        new MessageButton()
                            .setCustomId("5️⃣")
                            .setStyle("SECONDARY")
                            .setLabel('0')
                            .setEmoji("5️⃣")
                    )
                }

                const Embed = new MessageEmbed()
                    .setTitle(`${Title}`)
                    .setFooter({text: `Poll by ${user.tag}`})
                    .setColor('GREEN')
                    .setTimestamp()
                    .setDescription(Choices.join("\n\n"));

                const ErrorEmbed = new MessageEmbed()
                    .setColor("RED").setTitle('Error');

                try {
                    const M = await interaction.channel.send({embeds: [Embed], components: [Row]});
                    interaction.reply({content: 'Started poll', ephemeral: true})
                    await DB.create({
                        guildId: guild.id,
                        channelId: interaction.channel.id,
                        messageId: M.id,
                        //createdBy: user.id,
                        title: Title,
                        button1: 0,
                        button2: 0,
                        button3: Choice3 ? 0 : null,
                        button4: Choice4 ? 0 : null,
                        button5: Choice5 ? 0 : null,
                    });
                } catch (err) {
                    ErrorEmbed
                        .setDescription(`There was an error while trying to create a poll`);
                    interaction.reply({embeds: [Embed], ephemeral: true})
                    console.log(err);
                }
            }
            break;

            case "results": {
                const MessageID = interaction.options.getString("message_id");
                const Data = await DB.findOne({ guildID: guild.id, messageId: MessageID });
                const Embed = new MessageEmbed()
                if (!Data) {
                    Embed
                        .setColor("RED")
                        .setTitle('Error')
                        .setDescription(`Could not find any poll with that messageID`);
                    return interaction.reply({embeds: [Embed], ephemeral: true});
                }
                Embed
                    .setColor("NOT_QUITE_BLACK")
                    .setAuthor({name: `${Data.title}`})
                    .setFooter({text: `MessageID: ${MessageID}`})
                    .setTimestamp();
                
                let ButtonSize = [`1️⃣ - \`${Data.button1}\` Votes`, `2️⃣ - \`${Data.button2}\` Votes`];
                if (Data.button3 !== null) ButtonSize.push(`3️⃣ - \`${Data.button3}\` Votes`);
                if (Data.button4 !== null) ButtonSize.push(`4️⃣ - \`${Data.button4}\` Votes`);
                if (Data.button5 !== null) ButtonSize.push(`5️⃣ - \`${Data.button5}\` Votes`);

                Embed.setDescription(ButtonSize.join("\n\n"));
                interaction.reply({embeds: [Embed]});
            }
            break;

            case "end": {
                const MessageID = interaction.options.getString("message_id");
                const Data = await DB.findOne({ guildID: guild.id, messageId: MessageID });
                const Embed = new MessageEmbed()
                if (!Data) {
                    Embed
                        .setColor("RED")
                        .setTitle('Error')
                        .setDescription(`Could not find any poll with that messageID`);
                    return interaction.reply({embeds: [Embed], ephemeral: true});
                }
                Embed
                    .setAuthor({name: `${Data.title}`})
                    .setColor('RED')
                    .setFooter({text: `MessageID: ${MessageID} | Ended the poll`})
                    .setTimestamp();
                
                let ButtonSize = [`1️⃣ - \`${Data.button1}\` Votes`, `2️⃣ - \`${Data.button2}\` Votes`];
                if (Data.button3 !== null) ButtonSize.push(`3️⃣ - \`${Data.button3}\` Votes`);
                if (Data.button4 !== null) ButtonSize.push(`4️⃣ - \`${Data.button4}\` Votes`);
                if (Data.button5 !== null) ButtonSize.push(`5️⃣ - \`${Data.button5}\` Votes`);

                Embed.setDescription(ButtonSize.join("\n\n"));
                interaction.reply({content: 'Poll ended', ephemeral: true});
                Data.delete()
                const msg = await interaction.guild.channels.cache.get(interaction.channel.id).messages.fetch(MessageID)
                if (!msg) {
                    interaction.reply({content: 'I could not find a message in this channel with that ID. Please make sure the ID is correct or that you are running the command in the same channel as the poll', ephemeral: true})
                    return
                }
                msg.edit({embeds: [Embed], components: []})
            }
            break
        }
    },
};
