module.exports = {
name: 'emit',
aliases: [''],
description: 'Emit something',
category: 'Dev',
slash: true,
ownerOnly: true,
guildOnly: true,
testOnly: true,
options: [
    {
        name: 'event',
        description: 'The thing to emit',
        type: 'STRING',
        required: true
    }
],
cooldown: '',
requireRoles: false,
permissions: ['SEND_MESSAGES'],

callback: async({interaction, client, member, guild}) => {
    const event = interaction.options.getString('event')

    client.emit(event, member, guild)
    interaction.reply({content: `Emitted event: \`${event}\``})
}
}