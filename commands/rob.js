const balanceSchema = require('../models/balance-schema')
const boosterSchema = require('../models/boost-schema')

module.exports = {
        name: 'rob',
        description: 'Rob a user. Be carefull though it could come back to bite you',
        category: 'Economy',
        globalCooldown: '3m',
        slash: true,
        guildOnly: true,
        options: [
            {
                name: 'user',
                description: 'The user to rob',
                type: 'USER',
                required: true,
            },
        ],

        callback: async({interaction}) => {
            const blacklistSchema = require('../models/blacklist-schema')
            const blacklist = await blacklistSchema.findOne({userId: interaction.user.id})
            if (blacklist) {
                return
            }
            const maintenanceSchema = require('../models/mantenance-schema')
            const maintenance = await maintenanceSchema.findOne({maintenance: true})
            if (maintenance && interaction.user.id !== '804265795835265034') {
                return
            }
            const target = interaction.options.getUser('user')
            const theif = interaction.user

            const theifBal = await balanceSchema.findOne({guildId: interaction.guild.id, userId: theif.id})
            const targetBal = await balanceSchema.findOne({guildId: interaction.guild.id, userId: target.id})
            const boosterTheif = await boosterSchema.findOne({guildId: interaction.guild.id, userId: theif.id, type: 'ar'})
            const boosterTarget = await boosterSchema.findOne({guildId: interaction.guild.id, userId: target.id, type: 'ar'})

            const robLuck = Math.round(Math.random())
            const takeFromTheif = Math.round(Math.random() * Math.round((30 / 100) * theifBal.amount))
            const takeFromTarget = Math.round(Math.random() * Math.round((40 / 100) * targetBal.amount))

            if (boosterTarget) return `That user has an anti-rob booster active lol`
            if (boosterTheif) return `Don't try and rob others when they can't rob you`

            if (theif.id === target.id) return `You can't rob yourself`
            if (theifBal.amount < 3000) return `You need at least φ\`3000\` to rob someone`
            if (targetBal.amount < 3000) return `Its not nice to rob the poor`
            if (robLuck === 0) {
                targetBal.amount += takeFromTheif
                targetBal.save()
                theifBal.amount -= takeFromTheif
                theifBal.save()

                target.send({content: `${theif} tried to rob you but failed. They were made to pay φ\`${takeFromTheif}\` so yay for you.`})
                return `You failed to rob ${target}. You lost φ\`${takeFromTheif}\``
            } else {
                targetBal.amount -= takeFromTarget
                targetBal.save()
                theifBal.amount += takeFromTarget
                theifBal.save()

                target.send({content: `${theif} robbed you. They managed to steal φ\`${takeFromTarget}\`.`})
                return `You successfully robbed ${target}. You stole φ\`${takeFromTarget}\``
            }
        }
}