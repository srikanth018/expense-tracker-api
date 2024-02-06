const {MongoClient} = require('mongodb') // we use MongoClient only

let dbconn;
function connectionDB(callBack){
    
    
    MongoClient.connect('mongodb+srv://SRIKANTH_M:Prasanth-1801@cluster0.y5pkqsb.mongodb.net/?retryWrites=true&w=majority').then(function(cli){
        dbconn = cli.db()
        callBack()
    }).catch(function(error){
        callBack(error)
    })
}

function getDB(){
    return dbconn
}

module.exports = {connectionDB,getDB}