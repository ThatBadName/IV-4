const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const botSchema = new mongoose.Schema({
    announcement: String,
    maintenance: Boolean,
    maintenanceReason: String
})

const name = 'bot'
module.exports = mongoose.models[name] || mongoose.model(name, botSchema, name)