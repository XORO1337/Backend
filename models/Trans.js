const mongo = require('mongoose');

const TransSchema = new mongo.Schema({
    Trans_ID:{type:String, required:true,unique:true},
    Trans_Date:{type:Date, default:Date.now},
    
})

module.exports = mongo.model('Transaction',TransSchema);