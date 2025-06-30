const mongo = require('mongoose');

async function ConnectDB(){
    try{
        await mongo.connect('mongodb://localhost:27017/rootsReach',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })  
    }
    catch(err){
        console.error(`Error DB Connection : ${err}`);
    }

}
    
module.exports = ConnectDB;