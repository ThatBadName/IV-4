const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const got = require('got')

module.exports = (client) => {
   client.on('interactionCreate', async(interaction) => {
    if (!interaction.isButton()) return
    const blacklistSchema = require('../models/blacklist-schema')
    const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
    if (blacklist) {
        return
    }
    const maintenanceSchema = require('../models/mantenance-schema')
    const maintenance = await maintenanceSchema.findOne({maintenance: true})
        if (maintenance && interaction.user.id !== '804265795835265034') {
            interaction.reply ({content: `Maintenance mode is currently enabled. You are not able to run any commands or interact with the bot. || ${maintenance.maintenanceReason ? maintenance.maintenanceReason : 'No Reason Provided'}`, ephemeral: true,})
            return
        }
        
    if (interaction.customId === 'newMeme') {
        const embed = new MessageEmbed();
        got('https://www.reddit.com/r/memes/random/.json')
            .then(response => {
                const [list] = JSON.parse(response.body);
                const [post] = list.data.children;

                const permalink = post.data.permalink;
                const memeUrl = `https://reddit.com${permalink}`;
                const memeImage = post.data.url;
                const memeTitle = post.data.title;
                const memeUpvotes = post.data.ups;
                const memeNumComments = post.data.num_comments;

                embed.setTitle(`${memeTitle}`);
                embed.setURL(`${memeUrl}`);
                embed.setColor('RANDOM');
                embed.setImage(memeImage);
                embed.setFooter({text: `👍 ${memeUpvotes} 💬 ${memeNumComments}`});

                interaction.reply({embeds: [embed], components: [row]})
            })
            .catch(console.error);

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel('New Meme')
            .setCustomId('newMeme')
            .setStyle('SUCCESS')
        )   
    } else if (interaction.customId === 'newThought') {
        const embed = new MessageEmbed();
        got('https://www.reddit.com/r/Showerthoughts/random/.json')
            .then(response => {
                const [list] = JSON.parse(response.body);
                const [post] = list.data.children;

                const permalink = post.data.permalink;
                const memeUrl = `https://reddit.com${permalink}`;
                const memeImage = post.data.url;
                const memeTitle = post.data.title;
                const memeUpvotes = post.data.ups;
                const memeNumComments = post.data.num_comments;

                embed.setTitle(`${memeTitle}`);
                embed.setURL(`${memeUrl}`);
                embed.setColor('RANDOM');
                embed.setImage(memeImage);
                embed.setFooter({text: `👍 ${memeUpvotes} 💬 ${memeNumComments}`});

                interaction.reply({embeds: [embed], components: [row]})
            })
            .catch(console.error);

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel('New Thought')
            .setCustomId('newThought')
            .setStyle('SUCCESS')
        )   
    } else if (interaction.customId === 'newTdtm') {
        const embed = new MessageEmbed();
        got('https://www.reddit.com/r/theydidthemath/random/.json')
            .then(response => {
                const [list] = JSON.parse(response.body);
                const [post] = list.data.children;

                const permalink = post.data.permalink;
                const memeUrl = `https://reddit.com${permalink}`;
                const memeImage = post.data.url;
                const memeTitle = post.data.title;
                const memeUpvotes = post.data.ups;
                const memeNumComments = post.data.num_comments;

                embed.setTitle(`${memeTitle}`);
                embed.setURL(`${memeUrl}`);
                embed.setColor('RANDOM');
                embed.setImage(memeImage);
                embed.setFooter({text: `👍 ${memeUpvotes} 💬 ${memeNumComments}`});

                interaction.reply({embeds: [embed], components: [row]})
            })
            .catch(console.error);

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel('New TDTM')
            .setCustomId('newTdtm')
            .setStyle('SUCCESS')
        )   
    }

})
},

module.exports.config = {
   dbName: 'NEW_MEME',
   displayName: 'New meme',
}