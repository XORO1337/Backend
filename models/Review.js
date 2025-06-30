const mongo = require('mongoose');

const ReviewSchema = new mongo.Schema({
    Review_Id:{type:String, required:true,unique:true},
    
})

module.exports = mongo.model('Review',ReviewSchema);