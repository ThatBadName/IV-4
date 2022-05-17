const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const Memer = require('random-jokes-api')

module.exports = (client) => {
   client.on('interactionCreate', async(interaction) => {
    if (!interaction.isButton()) return
    if (interaction.customId === 'newMeme') {
        let meme = Memer.meme()

        const memeEmbed = new MessageEmbed()
        .setTitle(meme.title)
        .setImage(meme.url)
        .setFooter({text: `Category: ${meme.category}`})
        .setColor('RANDOM')

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel('New Meme')
            .setCustomId('newMeme')
            .setStyle('SUCCESS')
        )
        
        interaction.reply({embeds: [memeEmbed], components: [row]})       
    } else if (interaction.customId === 'newJoke') {
        let jokes = Memer.joke()

        const jokeEmbed = new MessageEmbed()
        .setDescription(`${jokes}`)
        .setColor('RANDOM')

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel('New Joke')
            .setCustomId('newJoke')
            .setStyle('SUCCESS')
        )

        interaction.reply({embeds: [jokeEmbed], components: [row]})
    }
})
},

module.exports.config = {
   dbName: 'NEW_MEME',
   displayName: 'New meme',
}