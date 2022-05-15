const { model, Schema } = require("mongoose");

module.exports = model("Poll", new Schema({
    GuildID: String,
    ChannelID: String,
    MessageID: String,
    CreatedBy: String,
    Users: [String],
    Title: String,
    Button1: Number,
    Button2: Number,
    Button3: Number,
    Button4: Number,
    Button5: Number
}));