const DiscordJS = require("discord.js")
const dotenv = require("dotenv")
const WOKCommands = require("wokcommands")
const path = require("path")
const maintenanceSchema = require('./models/mantenance-schema')
const antispamSchema = require('./models/antispam-schema')

const client = new DiscordJS.Client({
    intents: [
        DiscordJS.Intents.FLAGS.GUILDS,
        DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
        DiscordJS.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        DiscordJS.Intents.FLAGS.GUILD_MEMBERS,
        DiscordJS.Intents.FLAGS.GUILD_VOICE_STATES,
        DiscordJS.Intents.FLAGS.DIRECT_MESSAGES,
        DiscordJS.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ]
})

const { GiveawaysManager } = require('discord-giveaways');
// Starts updating currents giveaways

const manager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    default: {
        botsCanWin: false,
        embedColor: '#FF0000',
        embedColorEnd: '#000000',
        reaction: '🎉'
    }
});
client.giveawaysManager = manager;

process.on("unhandledRejection", (reason, p) => {
    console.log(" [antiCrash] :: Unhandled Rejection/Catch");
    console.log(reason, p);
});

process.on("uncaughtException", (err, origin) => {
    console.log(" [antiCrash] :: Uncaught Exception/Catch");
    console.log(err, origin);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
    //console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
    //console.log(err, origin);
});

process.on("multipleResolves", (type, promise, reason) => {
    //console.log(" [antiCrash] :: Multiple Resolves");
    //console.log(type, promise, reason);
});

dotenv.config()
setInterval(() => {
    client.emit('tick')
}, 60 * 1000)

client.on('tick', async() => {
    try {
        antispamSchema.collection.deleteMany()
    } catch (error) {
        console.log(error)
    }
})

client.on('ready', async () => {
    console.log('Bot online')
    console.log('done and Ready')
    new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        featuresDir: path.join(__dirname, 'features'),
        eventsDir: path.join(__dirname, 'events'), 
        testServers: ['919242919829979136'],
        botOwners: ['804265795835265034', '739396064104415243'],
        mongoUri: process.env.MONGO_URI,
        dbOptions: {
            keepAlive: true
        }
      })
      const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance) {
                client.user.setActivity('Maintenance Mode');
                client.user.setStatus('idle');
            }
    })

    client.login(process.env.TOKEN)