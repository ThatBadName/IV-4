const mongoose = require('mongoose');
const { Schema } = mongoose

const reqString = {
    type: String,
    required: true,
}

const schema = new Schema({
    userId: reqString,
    guildId: reqString,
    expires: Date,
    strength: Number,
    type: String
},
{
    timestamps: true,
})

const name = 'boosters'

module.exports = mongoose.models[name] || mongoose.model(name, schema)