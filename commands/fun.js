const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const got = require('got')
const Minesweeper = require('discord.js-minesweeper')

module.exports = {
name: 'fun',
aliases: [''],
description: 'Get a meme or a joke',
category: 'Fun',
slash: true,
ownerOnly: false,
guildOnly: true,
testOnly: false,
options: [
    {
        name: 'meme',
        description: 'Get a meme',
        type: 'SUB_COMMAND'
    },
    {
        name: 'showerthought',
        description: 'Get a shower thought',
        type: 'SUB_COMMAND'
    },
    {
        name: 'tdtm',
        description: 'They Did The Maths',
        type: 'SUB_COMMAND'
    },
    {
        name: 'minesweeper',
        description: 'Play a game of minesweeper',
        type: 'SUB_COMMAND',
        options: [
            {
                name: 'rows',
                description: 'How many rows? (Max 9)',
                type: 'INTEGER',
                required: false
            },
            {
                name: 'columns',
                description: 'How many columns? (Max 9)',
                type: 'INTEGER',
                required: false
            },
            {
                name: 'mines',
                description: 'How many mines? (Max 20)',
                type: 'INTEGER',
                required: false
            },
        ],
    },
],
cooldown: '',
requireRoles: false,
permissions: ['SEND_MESSAGES'],

callback: async({interaction}) => {
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

    if (interaction.options.getSubcommand() === 'meme') {
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
        
        interaction.reply({embeds: [memeEmbed], components: [row]}) 
    } else if (interaction.options.getSubcommand() === 'minesweeper') {
        let rows = interaction.options.getInteger('rows') || 9
        let columns = interaction.options.getInteger('columns') || 9
        let mines = interaction.options.getInteger('mines') || 10
        if (rows > 9) rows = 9
        if (columns > 9) columns = 9
        if (mines > 20) mines = 10

        const game = new Minesweeper({rows, columns, mines})
        const matrix = game.start()

        interaction.reply({content: `${matrix ? matrix.replaceAll(' ', '') : 'Invalid data'}`})
    } else if (interaction.options.getSubcommand() === 'showerthought') {
        const embed = new MessageEmbed();
        got('https://www.reddit.com/r/showerthoughts/random/.json')
            .then(response => {
                const [list] = JSON.parse(response.body);
                const [post] = list.data.children;

                const permalink = post.data.permalink;
                const memeUrl = `https://reddit.com${permalink}`;
                const memeImage = post.data.url;
                const memeTitle = post.data.title.slice(256)
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
    } else if (interaction.options.getSubcommand() === 'tdtm') {
        const embed = new MessageEmbed();
        got('https://www.reddit.com/r/theydidthemath/random/.json')
            .then(response => {
                const [list] = JSON.parse(response.body);
                const [post] = list.data.children;

                const permalink = post.data.permalink;
                const memeUrl = `https://reddit.com${permalink}`;
                const memeImage = post.data.url;
                const memeTitle = post.data.title.slice(256)
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
    }
}