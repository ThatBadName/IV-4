const { MessageEmbed } = require("discord.js")

module.exports = {
name: 'help',
aliases: [''],
description: 'Get a bit of help for the bot',
category: 'Misc',
slash: true,
ownerOnly: false,
guildOnly: true,
testOnly: false,
options: [
    {
        name: 'command',
        description: 'A command to get further info on',
        type: 'STRING',
        required: false
    },
],
cooldown: '2s',
requireRoles: false,
permissions: ['SEND_MESSAGES'],

callback: async({interaction, instance}) => {
    if (!interaction.options.getString('command')) {
        let textMisc = ''
        let textFun = ''
        let textModeration = ''
        let textDev = ''
        let textConfig = ''
        let textEconomy = ''
        let textAdmin = ''
        instance.commandHandler.commands.forEach((command) => {
            if (command.category === 'Misc') {
                let commands = command.names
                textMisc += `\`${commands[0]}\`, `
            }
            if (command.category === 'Fun') {
                let commands = command.names
                textFun += `\`${commands[0]}\`, `
            }
            if (command.category === 'Moderation') {
                let commands = command.names
                textModeration += `\`${commands[0]}\`, `
            }
            if (command.category === 'Dev') {
                let commands = command.names
                textDev += `\`${commands[0]}\`, `
            }
            if (command.category === 'Config') {
                let commands = command.names
                textConfig += `\`${commands[0]}\`, `
            }
            if (command.category === 'Economy') {
                let commands = command.names
                textEconomy += `\`${commands[0]}\`, `
            }
            if (command.category === 'Admin') {
                let commands = command.names
                textAdmin += `\`${commands[0]}\`, `
            }
        })
        const embed = new MessageEmbed()
        .setColor('0xFF3D15')
        .setTitle('Command List')
        .setFooter({text: `/help <command> for more info`})
        if (interaction.user.id !== '804265795835265034') {
            embed.setFields({
                name: 'Moderation Commands',
                value: textModeration.slice(0, -2)
            }, {
                name: 'Fun Commands',
                value: textFun.slice(0, -2)
            }, {
                name: 'Configuration Commands',
                value: textConfig.slice(0, -2)
            }, {
                name: 'Economy Commands',
                value: textEconomy.slice(0, -2)
            }, {
                name: 'Admin Commands',
                value: textAdmin.slice(0, -2)
            }, {
                name: 'Misc Commands',
                value: textMisc.slice(0, -2)
            })
        } else {
            embed.setFields({
                name: 'Moderation Commands',
                value: textModeration.slice(0, -2)
            }, {
                name: 'Fun Commands',
                value: textFun.slice(0, -2)
            }, {
                name: 'Configuration Commands',
                value: textConfig.slice(0, -2)
            }, {
                name: 'Economy Commands',
                value: textEconomy.slice(0, -2)
            }, {
                name: 'Admin Commands',
                value: textAdmin.slice(0, -2)
            }, {
                name: 'Misc Commands',
                value: textMisc.slice(0, -2)
            }, {
                name: 'Owner Commands',
                value: textDev.slice(0, -2)
            })
        }
        interaction.reply({embeds: [embed]})
    } else {
        const lookup = interaction.options.getString('command')
        instance.commandHandler.commands.forEach((command) => {
            if (command.names[0] === lookup) {
                let commandName = command.names[0]
                let commandDescription = command.description
                let commandCategory = command.category

                const embed = new MessageEmbed()
                .setTitle(`Info on the ${commandName} command`)
                .setFields({
                    name: `Usage`, value: `\`\`\`/${commandName}\`\`\``, inline: true
                }, {
                    name: 'Description', value: `\`\`\`${commandDescription}\`\`\``, inline: true
                }, {
                    name: 'Category', value: `\`\`\`${commandCategory}\`\`\``
                })
                .setColor('0xFF3D15')

                interaction.reply({embeds: [embed]})
            }
        })
        const embed = new MessageEmbed()
        .setTitle(`The command ${lookup} does not exist`)
        .setColor('0xFF0000')

        interaction.reply({embeds: [embed]}).catch((err) => {})
    }
}
}