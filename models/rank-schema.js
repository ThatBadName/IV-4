const mongoose = require('mongoose')
const { Schema } = mongoose

const reqString = {
    type: String,
    required: true,
}

const schema = new Schema({
    guildId: reqString,
    rankName: String,
    rankDescription: String,
    rankRole: String
})

const name = 'rankSchema'

module.exports = mongoose.models[name] || mongoose.model(name, schema)