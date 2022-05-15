const antispamSchema = require('../models/antispam-schema')

module.exports = (client) => {
    client.on('tick', async() => {
        try {
            antispamSchema.collection.deleteMany()
        } catch (error) {
            console.log(error)
        }
    })
}

module.exports.config = {
    dbName: 'tick',
    displayName: 'tick'
}