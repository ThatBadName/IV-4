const db = require('quick.db')

module.exports = (client) => {
    client.on('messageDelete', async (message) => {
        db.set(`snipemsg_${message.channel.id}`, message.content)
        db.set(`snipesender_${message.channel.id}`, message.author.id)
    })
}
module.exports.config = {
    dbName: 'SNIPE',
    displayName: 'Snipe'
}