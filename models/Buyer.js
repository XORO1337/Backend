const mongo = require('mongoose');

const BuyersSchema = new mongo.Schema({
    BuyerId : {type: String, required: true , unique: true},
    BName :{type: String, required: true},
    BOrg:{type: String , required:true},
    BLoc:{type: String, required: true},
    BJoined:{type: Date, default:Date.now}
});

module.exports = mongoose.model('Buyer', BuyersSchema);