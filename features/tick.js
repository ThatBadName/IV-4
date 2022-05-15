module.exports = (client) => {
    client.on('tick', async() => {
        try {
            antispamSchema.collection.deleteMany()
        } catch (error) {
        }
    })
}

module.exports.config = {
    dbName: 'TICK',
    displayName: 'TICK'
}