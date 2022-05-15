const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "listguilds",
    description: "Shows total guilds/names.",
    category: 'Dev',
    slash: true,
    testOnly: true,
    ownerOnly: true,

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    callback: async({interaction, client}) => {
        const blacklistSchema = require('../models/blacklist-schema')
        const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
        if (blacklist) {
            return
        }
                const guild = client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).first(50);
        const description = guild.map((guild, index) => `#**${index + 1}** ${guild.name} | \`${guild.id}\` | ${guild.memberCount} Members`).join('\n');
        let embed = new MessageEmbed()
            .setDescription(`\`\`\`${description}\`\`\``)
            .setColor('BLUE')
        interaction.reply({ embeds: [embed]});
    }
}