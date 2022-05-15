const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
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
                            .setCustomId("poll-1")
                            .setStyle("SECONDARY")
                            .setLabel("1️⃣"),
                        new MessageButton()
                            .setCustomId("poll-2")
                            .setStyle("SECONDARY")
                            .setLabel("2️⃣")
                    )

                if (Choice3) {
                    Choices.push(`3️⃣ ${Choice3}`);
                    Row.addComponents(
                        new MessageButton()
                            .setCustomId("poll-3")
                            .setStyle("SECONDARY")
                            .setLabel("3️⃣")
                    )
                }
                if (Choice4) {
                    Choices.push(`4️⃣ ${Choice4}`);
                    Row.addComponents(
                        new MessageButton()
                            .setCustomId("poll-4")
                            .setStyle("SECONDARY")
                            .setLabel("4️⃣")
                    )
                }
                if (Choice5) {
                    Choices.push(`5️⃣ ${Choice5}`);
                    Row.addComponents(
                        new MessageButton()
                            .setCustomId("poll-5")
                            .setStyle("SECONDARY")
                            .setLabel("5️⃣")
                    )
                }

                const Embed = new MessageEmbed()
                    .setTitle(`${Title}`)
                    .setFooter({text: `Poll by ${user.tag}`})
                    .setColor("NOT_QUITE_BLACK")
                    .setTimestamp()
                    .setDescription(Choices.join("\n\n"));

                const ErrorEmbed = new MessageEmbed()
                    .setColor("RED").setTitle('Error');

                try {
                    const M = await interaction.reply({embeds: [Embed], components: [Row], fetchReply: true});
                    await DB.create({
                        GuildID: guild.id,
                        ChannelID: interaction.channel.id,
                        MessageID: M.id,
                        CreatedBy: user.id,
                        Title: Title,
                        Button1: 0,
                        Button2: 0,
                        Button3: Choice3 ? 0 : null,
                        Button4: Choice4 ? 0 : null,
                        Button5: Choice5 ? 0 : null,
                    });
                } catch (err) {
                    ErrorEmbed
                        .setDescription(`There was an error while trying to create a poll`);
                    interaction.reply({embeds: [Embed], ephemeral: true});
                    console.log(err);
                }
            }
            break;

            case "results": {
                const MessageID = interaction.options.getString("message_id");
                const Data = await DB.findOne({ GuildID: guild.id, MessageID: MessageID });
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
                    .setAuthor({name: `${Data.Title}`})
                    .setFooter({text: `MessageID: ${MessageID}`})
                    .setTimestamp();
                
                let ButtonSize = [`1️⃣ - \`${Data.Button1}\` Votes`, `2️⃣ - \`${Data.Button2}\` Votes`];
                if (Data.Button3 !== null) ButtonSize.push(`3️⃣ - \`${Data.Button3}\` Votes`);
                if (Data.Button4 !== null) ButtonSize.push(`4️⃣ - \`${Data.Button4}\` Votes`);
                if (Data.Button5 !== null) ButtonSize.push(`5️⃣ - \`${Data.Button5}\` Votes`);

                Embed.setDescription(ButtonSize.join("\n\n"));
                interaction.reply({embeds: [Embed]});
            }
            break;
        }
    },
};
