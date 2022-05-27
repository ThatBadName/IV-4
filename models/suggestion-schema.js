const { model, Schema } = require("mongoose");

module.exports = model("Suggestion", new Schema({
    guildId: String,
    channelId: String,
    messageId: String,
    createdBy: String,
    users: [String],
    votes: {},
    title: String,
    button1: Number,
    button2: Number,
}));