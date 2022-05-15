const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "voice",
  description: "Manage users in a VC.",
  category: 'Moderation',
  slash: true,
  guildOnly: true,
  permissions: ["MOVE_MEMBERS"],
  options: [
    {
      name: 'move',
      description: 'Move all users in a VC',
      type: 'SUB_COMMAND',
      options: [
        {
          name: "move-from",
          description: "Select the channel you want to move the members from.",
          type: "CHANNEL",
          channelTypes: ["GUILD_VOICE"],
          required: true,
        },
        {
          name: "move-to",
          description: "Select the channel you want to move the members to.",
          type: "CHANNEL",
          channelTypes: ["GUILD_VOICE"],
          required: true,
        }
      ],
    },
    {
      name: 'mute',
      description: 'Server mute all users in a VC',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'vc',
          description: 'The VC to mute',
          type: 'CHANNEL',
          channelTypes: ['GUILD_VOICE'],
          required: true,
        },
      ],
    },
    {
      name: 'deafen',
      description: 'Server deafen all users in a VC',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'vc',
          description: 'The VC to deafen',
          type: 'CHANNEL',
          channelTypes: ['GUILD_VOICE'],
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
            }
        
    const { member, guild, options } = interaction;
    if (interaction.options.getSubcommand() === 'move') {
      const newChannel = options.getChannel("move-to");
      const voiceChannel = options.getChannel("move-from");
      
      if(newChannel === voiceChannel) return interaction.reply({content: "You can't move members to the same channel they are already in!", ephemeral: true})
      if(voiceChannel.members.size < 1) return interaction.reply({content: "There are no members in that voice channel!", ephemeral: true})

      voiceChannel.members.forEach(m => {
        m.voice.setChannel(newChannel, `Voice Moved by ${member.user.tag}`)
      })
      interaction.reply({content: `Moved all users to ${newChannel}.`, ephemeral: true})
    } else if (interaction.options.getSubcommand() === 'mute') {
      const voiceChannel = options.getChannel('vc')

      if(voiceChannel.members.size < 1) return interaction.reply({content: "There are no members in that voice channel!", ephemeral: true})

      voiceChannel.members.forEach(m => {
        if (m.id === interaction.user.id) {

        } else
        m.voice.setMute(true)
      })
      interaction.reply({content: `Muted all members in ${voiceChannel}`, ephemeral: true})
    } else if (interaction.options.getSubcommand() === 'deafen') {
      const voiceChannel = options.getChannel('vc')

      if(voiceChannel.members.size < 1) return interaction.reply({content: "There are no members in that voice channel!", ephemeral: true})

      voiceChannel.members.forEach(m => {
        if (m.id === interaction.user.id) {

        } else
        m.voice.setDeaf(true)
      })
      interaction.reply({content: `Deafened all members in ${voiceChannel}`, ephemeral: true})
    }
  }
}
