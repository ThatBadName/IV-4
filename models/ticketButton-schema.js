const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
   guildId: String,
   ticketId: String,
   button: String,
   expires: Date,
}, {
   timestamps: false
})

const name = 'ticketButtons'
module.exports = mongoose.models[name] || mongoose.model(name, schema)