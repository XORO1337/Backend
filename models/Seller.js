const mongo = require('mongoose');

const SellerSchema = new mongo.Schema({
    Seller_Id:{type:String, required:true,unique:true},
    
})

module.exports = mongo.model('Seller',SellerSchema);