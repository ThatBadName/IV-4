const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const levelSchema = new mongoose.Schema({
    guildId: String,
    userId: reqString,
    xp: Number,
    level: Number,
    role: String
})

const name = 'level'
module.exports = mongoose.models[name] || mongoose.model(name, levelSchema, name)