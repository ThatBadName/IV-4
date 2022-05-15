const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
   guildId: String,
   wrId: String,
   wcId: String,
   message: String
}, {
   timestamps: false
})

const name = 'Welcome'
module.exports = mongoose.models[name] || mongoose.model(name, schema)