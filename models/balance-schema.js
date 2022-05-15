const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const balSchema = new mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    amount: {type: Number, default: 0},
    bankAmount: Number
})

const name = 'balance'
module.exports = mongoose.models[name] || mongoose.model(name, balSchema, name)