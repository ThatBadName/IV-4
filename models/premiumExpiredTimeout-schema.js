const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
   guildId: String,
   expires: Date,
   channelId: String,
   messageId: String
}, {
   timestamps: false
})

const name = 'PremiumTimeout'
module.exports = mongoose.models[name] || mongoose.model(name, schema)