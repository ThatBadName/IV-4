const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
    guildId: String,
    itemName: String,
    itemDescription: String,
    itemPrice: Number,
    itemRole: String,
    itemStock: String
})

const name = 'shop'

module.exports = mongoose.models[name] || mongoose.model(name, schema)