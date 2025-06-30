const mongo = require('mongoose');

const OrderSchema = new mongo.Schema({
    OrderID:{type: String, required: true, unique: true},
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer'
    },
    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
    },
    total_price: Number

})

module.exports = mongo.model('Order', OrderSchema);
