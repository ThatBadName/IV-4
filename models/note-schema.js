const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const noteSchema = new mongoose.Schema({
    userId: reqString,
    note: String
})

const name = 'note'
module.exports = mongoose.models[name] || mongoose.model(name, noteSchema, name)