const { MessageEmbed, InteractionWebhook } = require('discord.js')
const shopSchema = require('../models/shop-schema')
const balanceSchema = require('../models/balance-schema')
const boosterSchema = require('../models/boost-schema')

module.exports = {
    name: 'shop',
    description: 'Manage/buy an item from the shop.',
    category: 'Economy',
    slash: true,
    cooldown: '3s',
    guildOnly: true,
    options: [
        {
            name: 'add',
            description: 'Add an item to the shop',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'name',
                    description: 'The name of the item',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'description',
                    description: 'The description of the item',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'price',
                    description: 'The price of the item',
                    type: 'NUMBER',
                    required: true,
                },
                {
                    name: 'stock',
                    description: 'The amount of stock this item has (put 0 for infinity)',
                    type: 'NUMBER',
                    required: true,
                },
                {
                    name: 'role',
                    description: 'The role to be given for buying this item',
                    type: 'ROLE',
                    required: true,
                },
            ],
        },
        {
            name: 'restock',
            description: 'Restock an item in the shop',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'item',
                    description: 'The item to restock',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'stock',
                    description: 'How much to set the stock to',
                    type: 'NUMBER',
                    required: true,
                },
            ],
        },
        {
            name: 'remove',
            description: 'Remove an item from the shop',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'item',
                    description: 'The name of the item to remove',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'edit',
            description: 'Edit an item on the shop',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'item',
                    description: 'The item to edit',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'new-name',
                    description: 'Change the name of the item',
                    type: 'STRING',
                    required: false,
                },
                {
                    name: 'new-description',
                    description: 'Change the description of the item',
                    type: 'STRING',
                    required: false,
                },
                {
                    name: 'new-price',
                    description: 'Change the price of the item',
                    type: 'NUMBER',
                    required: false,
                },
                {
                    name: 'new-stock',
                    description: 'Change the stock of the item (put 0 for infinity)',
                    type: 'NUMBER',
                    required: false,
                },
                {
                    name: 'new-role',
                    description: 'Change the role of the item',
                    type: 'ROLE',
                    required: false,
                },
            ],
        },
        {
            name: 'view',
            description: 'View the shop',
            type: 'SUB_COMMAND',
        },
        {
            name: 'info',
            description: 'Get more infomation on an item',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'item',
                    description: 'The item to view',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'buy',
            description: 'Buy an item from the shop',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'item',
                    description: 'The name of the item to buy',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'booster',
            description: 'Buy a booster',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'booster',
                    description: 'Select a booster',
                    type: 'STRING',
                    required: true,
                    //<type(2)|duration(4)|strength(1)|price(7)>
                    choices: [
                        {
                            name: 'View Active Booster',
                            value: 'view',
                        },
                        {
                            name: 'XP Boost x2 1h (φ3000)',
                            value: 'xp006020003000'
                        },
                        {
                            name : 'XP Boost x2 6h (φ18000)',
                            value: 'xp036020018000',
                        },
                        {
                            name: 'XP Boost x2 12h (φ36000)',
                            value: 'xp072020036000',
                        },
                        {
                            name: 'XP Boost x3 1h (φ5000)',
                            value: 'xp006030005000',
                        },
                        {
                            name: 'XP Boost x3 6h (φ20000)',
                            value: 'xp036030020000',
                        },
                        {
                            name: 'XP Boost x3 12h (φ40000)',
                            value: 'xp072030040000',
                        },
                        {
                            name : 'Anti-rob 6h (φ20000)',
                            value: 'ar036000020000',
                        },
                        {
                            name: 'Anti-rob 12h (φ50000)',
                            value: 'ar072000050000',
                        },
                    ],
                },
            ],
        },
    ],

    callback: async ({interaction, guild, member}) => {
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
        
        if(interaction.options.getSubcommand() === 'add') {
            if(!member.permissions.has('ADMINISTRATOR')) return `You do not have permission to use this`

            const name = interaction.options.getString('name')
            const description = interaction.options.getString('description')
            const price = interaction.options.getNumber('price')
            var stock = interaction.options.getNumber('stock')
            const role = interaction.options.getRole('role')

            if (stock === 0) {
                var stock = '∞'
            }

            await shopSchema.create({
                guildId: interaction.guild.id,
                itemName: name,
                itemDescription: description,
                itemPrice: price,
                itemRole: role,
                itemStock: stock
            })

            const shopAddEmbed = new MessageEmbed()
            .setTitle('Added new item to the shop')
            .setColor('GREEN')
            .setFields(
                {
                    name: 'Item Name',
                    value: `${name}`,
                    inline: true,
                }, {
                    name: 'Item Description',
                    value: `${description}`,
                    inline: true,
                }, {
                    name: 'Item Price',
                    value: `⏣\`${price}\``,
                    inline: true,
                }, {
                    name: 'Item Stock',
                    value: `\`${stock}\``,
                    inline: true,
                }, {
                    name: 'Item Role',
                    value: `${role}`,
                    inline: true,
                }
            )
            return shopAddEmbed
        } else if (interaction.options.getSubcommand() === 'remove') {
            if(!member.permissions.has('ADMINISTRATOR')) return `You do not have permission to use this`

            const name = await interaction.options.getString('item')
            const result = await shopSchema.findOne({
                guildId: interaction.guild.id,
                itemName: name
            })

            if (!result) {
                return `Could not find item with the name "${name}"`
            } else {
                const desc = result.itemDescription
                const price = result.itemPrice
                const stock = result.itemStock
                const role = result.itemRole
                result.delete()
                const shopRemoveEmbed = new MessageEmbed()
                    .setTitle('Removed an item from the shop')
                    .setFields(
                        {
                            name: 'Item Name',
                            value: `${name}`,
                            inline: true,
                        }, {
                            name: 'Item Description',
                            value: `${desc}`,
                            inline: true,
                        }, {
                            name: 'Item Price',
                            value: `⏣\`${price}\``,
                            inline: true,
                        }, {
                            name: 'Item Stock',
                            value: `\`${stock}\``,
                            inline: true,
                        }, {
                            name: 'Item Role',
                            value: `${role}`,
                            inline: true,
                        }
                    )
                    .setColor('RED')
                return shopRemoveEmbed
            }
            
        } else if (interaction.options.getSubcommand() === 'view') {
            const items = await shopSchema.find({guildId: interaction.guild.id,})

            let title = `Welcome to the IV-5 shop`
            let description = ``

            for (const item of items) {
                description += `> **${item.itemName}**\n`
                description += `> **Price:** ⏣\`${item.itemPrice}\`\n`
                description += `> **Stock Left:** \`${item.itemStock}\`\n\n`
            }
            const shopViewEmbed = new MessageEmbed().setTitle(title).setDescription(description).setColor('RANDOM')
            return shopViewEmbed
        } else if (interaction.options.getSubcommand() === 'info') {
            const name = interaction.options.getString('item')
            const item = await shopSchema.findOne({
                itemName: name,
                guildId: interaction.guild.id,
            })

            if (!item) {
                return `Could not find item with the name "${name}"`
            } else {
                const shopInfoEmbed = new MessageEmbed()
                    .setTitle(`Info on "${item.itemName}"`)
                    .setFields(
                        {
                            name: 'Item Name',
                            value: `${item.itemName}`,
                            inline: true,
                        }, {
                            name: 'Item Description',
                            value: `${item.itemDescription}`,
                            inline: true,
                        }, {
                            name: 'Item Price',
                            value: `⏣\`${item.itemPrice}\``,
                            inline: true,
                        }, {
                            name: 'Item Stock',
                            value: `\`${item.itemStock}\``,
                            inline: true,
                        }, {
                            name: 'Item Role',
                            value: `${item.itemRole}`,
                            inline: true,
                        }
                    )
                    .setColor('RANDOM')
                    return shopInfoEmbed
            }
        } else if (interaction.options.getSubcommand() === 'buy') {
                const name = interaction.options.getString('item')
                const user = interaction.user
                const item = await shopSchema.findOne({
                    itemName: name,
                    guildId: interaction.guild.id,
                })
                var walletBal = await balanceSchema.findOne({
                    userId: user.id,
                    guildId: interaction.guild.id,
                })

                if (item.itemStock === 0) {
                    return `${user}, this item is out of stock`
                }
                if (!item) {
                    return `I could not find that item`
                }
                if (!walletBal) {
                    return `Hmm, I couldn't find you in my database. Please send a message or run \`/balance register\``
                }
                if (walletBal.amount < item.itemPrice) {
                    return `${user}, you do not have enough money to buy this (You have ⏣\`${walletBal.amount}\` and ${item.itemName} requires ⏣\`${item.itemPrice}\`)`
                }

                const data = await balanceSchema.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id
                });
                    data.amount -= item.itemPrice;
                    data.save();

                    
                const role = item.itemRole.replace(/[<@!&>]/g, '')
                interaction.member.roles.add(role)

                if (item.itemStock === '∞') {

                } else {
                    item.itemStock -= 1,
                    item.save()
                }
                return `${user}, you have bought ${item.itemName} for ⏣\`${item.itemPrice}\``


        } else if (interaction.options.getSubcommand() === 'restock') {
            if(!member.permissions.has('ADMINISTRATOR')) return `You do not have permission to use this`

            const name = interaction.options.getString('item')
            const stock = interaction.options.getNumber('stock')

            const item = await shopSchema.findOne({
                itemName: name,
                guildId: interaction.guild.id,
            })
            const shopUpdateEmbed = new MessageEmbed()
            .setTitle('Updated item in the shop')
            .setColor('GREEN')
            .setFields(
                {
                    name: 'Item Name',
                    value: `${name}`,
                    inline: true,
                }, {
                    name: 'Item Description',
                    value: `${item.itemDescription}`,
                    inline: true,
                }, {
                    name: 'Item Price',
                    value: `⏣\`${item.itemPrice}\``,
                    inline: true,
                }, {
                    name: 'Item Stock Before',
                    value: `\`${item.itemStock}\``,
                    inline: true,
                },
                {
                    name: 'Item Stock Added',
                    value: `\`${stock}\``,
                    inline: true,
                }, {
                    name: 'Item Stock After',
                    value: `\`${item.itemStock += stock}\``,
                    inline: true,
                }, {
                    name: 'Item Role',
                    value: `${item.itemRole}`,
                    inline: true,
                }
            )

            if(!item) {
                return `I could not find that item`
            } else {
                item.itemStock + stock
                item.save()
                return shopUpdateEmbed
            }

        } else if (interaction.options.getSubcommand() === 'edit') {
            if(!member.permissions.has('ADMINISTRATOR')) return `You do not have permission to use this`
            const name = interaction.options.getString('item')

            const item = await shopSchema.findOne({
                itemName: name,
                guildId: interaction.guild.id,
            })

            if(!item) {
                return `I could not find that item`
            } else {
                    const oldStock = item.itemStock
                    const oldName = item.itemName
                    const oldDesc = item.itemDescription
                    const oldPrice = item.itemPrice
                    const oldRole = item.itemRole
                    const name = interaction.options.getString('new-name') || item.itemName
                    const description = interaction.options.getString('new-description') || item.itemDescription
                    const price = interaction.options.getNumber('new-price') || item.itemPrice
                    var stock = interaction.options.getNumber('new-stock') || item.itemStock
                    const role = interaction.options.getRole('new-role') || item.itemRole

                    if (stock === 0) {
                        var stock = '∞'
                    }
                    if (stock === null) {
                        var stock = item.itemStock
                    }
                    item.itemName = name,
                    item.itemDescription = description,
                    item.itemPrice = price,
                    item.itemStock = stock,
                    item.itemRole = role,
                    item.save()

                    const shopEditEmbed = new MessageEmbed()
                        .setTitle('Updated item in the shop')
                        .setColor('GREEN')
                        .setFields(
                            {
                                name: 'Old Item Name',
                                value: `${oldName}`,
                                inline: true,
                            }, {
                                name: 'New Item Name',
                                value: `${name}`,
                                inline: true,
                            }, {
                                name: 'Old Item Description',
                                value: `${oldDesc}`,
                                inline: true,
                            }, {
                                name: 'New Item Description',
                                value: `${description}`,
                                inline: true,
                            }, {
                                name: 'Old Item Price',
                                value: `⏣\`${oldPrice}\``,
                                inline: true,
                            }, {
                                name: 'New Item Price',
                                value: `⏣\`${price}\``,
                                inline: true,
                            }, {
                                name: 'Old Item Stock',
                                value: `\`${oldStock}\``,
                                inline: true,
                            }, {
                                name: 'New Item Stock',
                                value: `\`${stock}\``,
                                inline: true,
                            }, {
                                name: 'Old Item Role',
                                value: `${oldRole}`,
                                inline: true,
                            }, {
                                name: 'New Item Role',
                                value: `${role}`,
                                inline: true,
                            }
                        )

                return shopEditEmbed
            }
        } else if (interaction.options.getSubcommand() === 'booster') {
            const booster = interaction.options.getString('booster')
            const data = await boosterSchema.findOne({guildId: interaction.guild.id, userId: interaction.user.id})
            const bal = await balanceSchema.findOne({guildId: interaction.guild.id, userId: interaction.user.id})
            if (!bal) return `You are not registered please send a message or run \`/balance register\``
            if (booster === 'view') {
                if (data) {
                    const checkBoosterEmbed = new MessageEmbed()
                    .setTitle('Current booster')
                    .setFields({
                        name: 'Type:',
                        value: `${data.type.replace('ar', 'Anti-rob')}`,
                        inline: true,
                    }, {
                        name: 'Expires:',
                        value: `<t:${Math.round(data.expires.getTime() / 1000)}:R>`,
                        inline: true,
                    }, {
                        name: 'Strength:',
                        value: `${data.strength}`,
                        inline: true
                    })
                    .setColor('RANDOM')
                    return checkBoosterEmbed
                } else {
                    return `You do not currently have a booster active`
                }
            }

            if (data) return `Don't be greedy you can only have one booster active at once. You have a ${data.type.replace('ar', 'Anti-rob')} booster that expires <t:${Math.round(data.expires.getTime() / 1000)}:R>`
//New start
            const expires = new Date()
            const commandBoots = interaction.options.getString('booster')
            const time = commandBoots.slice(2,6)
            const fixedTime = parseFloat(time)
            expires.setMinutes(expires.getMinutes() + fixedTime)
            const price = commandBoots.slice(7,14)

            if(bal.amount < parseFloat(price)) return 'You do not have enough to buy this'

            bal.amount -= parseFloat(price)
            bal.save()


            await new boosterSchema({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
                expires: expires,
                type: commandBoots.slice(0,2),
                strength: commandBoots.slice(6,7)
            }).save()

            const boosterEmbed = new MessageEmbed()
            .setTitle('You bought a booster!')
            .setFields({
                name: 'Type:',
                value: `${commandBoots.slice(0,2).replace('ar', 'Anti-rob')}`,
                inline: true,
            }, {
                name: 'Expires:',
                value: `<t:${Math.round(expires.getTime() / 1000)}:R>`,
                inline: true,
            }, {
                name: 'Strength:',
                value: `${commandBoots.slice(6,7)}`,
                inline: true
            })
            .setColor('GREEN')

            interaction.reply({embeds: [boosterEmbed]})
//new end
            
        }
    }
}
