const mongo = require('mongoose');

const ProductSchema = new mongo.Schema({
    Prod_ID :{type:String, unique:true},
    Prod_Name:{type:String, required:true},
    Prod_Desc:{type:String, required:true},
    Prod_price:{type:String, required:true},
    Prod_Img:{type:Buffer, required:true},
    Prod_Instock:{type:Boolean, default:false}, // This will be used to keep in check about whether the Product is in Stock or not .
})

module.exports = mongo.model('Product', ProductSchema);
