const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
   guildId: String,
   userId: String,
   reminder: String,
   channelId: String,
   expires: Date,
   reminderSet: Date,
   reminderId: String
}, {
   timestamps: false
})

const name = 'reminder'
module.exports = mongoose.models[name] || mongoose.model(name, schema)