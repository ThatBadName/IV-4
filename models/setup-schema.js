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
    loggingEnabled: {type: Boolean, default: true},
    automodEnabled: {type: Boolean, default: true},
    levellingEnabled: {type: Boolean, default: true},
    economyEnabled: {type: Boolean, default: true},
})

const name = 'setupSchema'

module.exports = mongoose.models[name] || mongoose.model(name, schema)