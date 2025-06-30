const mongo = require('mongoose');

const MaterialSchema = new mongo.Schema({
    materialID:{type: String, required: true, unique: true},
    mName:{type:String, required: true },
    mDesc:{type:String, required:true},
    mPrice:{type:Number, required:true, default:0}, 
    mImage:{type:Buffer}, // For Image of Materials
    mAdded:{type: Date, default:Date.now} 

})

module.exports = mongo.model('Material', MaterialSchema);