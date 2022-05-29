const path = require('path');
const boosterSchema = require(path.join(__dirname, '../models/ticketButton-schema'));

module.exports = (client) => {
    
    const check = async () => {
        const query = {
            expires: { $lt: new Date() },
        }

        await boosterSchema.deleteMany(query)
        setTimeout(check, 1000 * 60)
    }
    check()
}

module.exports.config = {
    dbName: 'EXPIRED BOOSTER',
    displayName: 'Expired Booster' 
}
