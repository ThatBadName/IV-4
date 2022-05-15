const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "role",
    description: "Manage a user's roles",
    category: 'Moderation',
    permissions: ["MANAGE_ROLES"],
    slash: true,
    guildOnly: true,
    options: [
        {
            name: "role",
            description: "Provide a role to add or remove.",
            type: "ROLE",
            required: true,
        },
        {
            name: "target",
            description: "Provide a user to manage.",
            type: "USER",
            required: false,
        },
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    callback: async({interaction}) => {
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
        
        const { options } = interaction;
        const role = options.getRole("role");
        const target = options.getMember("target") || interaction.member;
        const embed = new MessageEmbed()
            .setColor(`#${interaction.guild.roles.cache.get(role.id).color.toString(16)}`)

        if (!role.editable || role.position === 0) {
            embed.setDescription(`I cannot give/remove ${role}`)
            .setTitle('Error')
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
        if (role.position >= interaction.member.roles.highest.position) {
            embed.setDescription(`You do not have permission to give/remove ${role}`)
            .setTitle('Error')
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
        
        embed.setDescription(target.roles.cache.has(role.id) ? `Removed the ${role} role from ${target}.` : `Added the ${role} role to ${target}.`);
        target.roles.cache.has(role.id) ? target.roles.remove(role) : target.roles.add(role);
        const message = await interaction.reply({embeds: [embed], fetchReply: true});
        setTimeout(() => message.delete().catch(() => {}), 5000);
    }
}