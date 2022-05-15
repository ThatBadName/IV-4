const { MessageEmbed } = require('discord.js')
const noteSchema = require('../models/note-schema')

module.exports = {
    name: 'note',
    description: 'Set a note for a user',
    category: 'Misc',
    slash: true,
    permissions: ['MANAGE_MESSAGES'],
    guildOnly: true,
    options: [
        {
            name: 'view',
            description: 'View a users note',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The user who\'s note to view',
                    type: 'USER',
                    required: true,
                },
            ],
        },
        {
            name: 'set',
            description: 'Set a users note',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The user who\'s note to set',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'note',
                    description: 'What to set the note to (leave blank to clear)',
                    type: 'STRING',
                    required: false,
                },
            ],
        },
    ],

    callback: async ({interaction}) => {
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
        
        if (interaction.options.getSubcommand() === 'view') {
            const user = interaction.options.getUser('user')
            const userID = user.id
            try {
                const note = await noteSchema.findOne({
                    userId: userID
                })
                const noteEmbed = new MessageEmbed()
                .setTitle(`${user.tag}'s note`)
                .setDescription(`${note.note}`)
                .setColor('RANDOM')
                interaction.reply({
                    embeds: [noteEmbed],
                    ephemeral: true
                })
            } catch(err) {
                interaction.reply({
                    content: `This user has no note set`,
                    ephemeral: true,
                })
            }
            
        } else {
            const user = interaction.options.getUser('user')
            const userID = user.id
            const note = await noteSchema.findOne({
                userId: userID
            })
            if (interaction.options.getString('note')) {
                var newNote = interaction.options.getString('note')
                var newNote = newNote.replaceAll("/n/", "\n")

                    try {
                        note.delete()
                    } catch(err) {

                    }
                    noteSchema.create({userId: userID, note: newNote})
                    const noteCreateEmbed = new MessageEmbed()
                        .setTitle(`${user.tag}'s note`)
                        .setDescription(`${newNote}`)
                        .setColor('RANDOM')
                        interaction.reply({
                            embeds: [noteCreateEmbed],
                            ephemeral: true
                        })
            } else {
                try {
                    note.delete()
                    interaction.reply({
                        content: `Deleted ${user}'s note`,
                        ephemeral: true
                    })
                } catch(err) {
                    interaction.reply({
                        content: `This user has no note set`,
                        ephemeral: true,
                    })
                }
            }
        }
    }
}