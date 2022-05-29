const mongoose = require('mongoose')
const { Schema } = mongoose

const reqString = {
    type: String,
    required: true,
}

const schema = new Schema({
    guildId: reqString,
    code: String,
    supportId: String,
    supportCatId: String,
    supportCatIdClosed: String,
    guildInvite: String,
    guildAppeal: String,
    rankCard: Boolean,
    suggestionChannelId: String,
    logChannelId: String,
    advertisingChannelId: String,
})

const name = 'setupSchema'

module.exports = mongoose.models[name] || mongoose.model(name, schema)