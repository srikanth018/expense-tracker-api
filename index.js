const express = require('express')
const {connectionDB,getDB} = require('./connectDB')
const {ObjectId} = require('mongodb')

const app = express()
app.use(express.json())

let db
connectionDB(function(error) {
    if(error) {
        console.log('Could not establish connection...')
        console.log(error)
    } else {
        const port = process.env.PORT || 8000
        app.listen(port)
        db = getDB()
        console.log(`Listening on port ${port}...`)
    }
})

app.post('/add-entry', function(request,response){
    db.collection('ex-tracker').insertOne(request.body).then(()=>{
        response.status(200).send({"status":"data entry confirmed"})
    }).catch(()=>{
        response.status(501).send({"status":"data not send"})
    })
})

app.get('/show-entry',function(request,response){
    const entries =[]
    db.collection('ex-tracker').find().forEach(element => {
        entries.push(element)
    }).then(()=>{
        response.status(200).json(entries)
    }).catch(()=>{response.status(501).json({"status":"data not send"})})
})

app.delete('/delete-entry',function(request,response){
    if(ObjectId.isValid(request.query.id)){
        db.collection('ex-tracker').deleteOne({
            _id: new ObjectId(request.query.id)
        }).then(()=>response.json({"status":"data deleted"}))
        .catch(()=>response.json({"status":"data not deleted"}))
    }else{
        response.json({"status":"Invalid ID"})
    }
})

app.patch('/update-entry/:id',(request,response)=>{
    if(ObjectId.isValid(request.params.id)){
        db.collection('ex-tracker').updateOne(
            { _id : new ObjectId(request.params.id) },{$set : request.body})
        .then(()=>{response.json({"status":"data updated"})})
        .catch(()=> response.json({"status":"data not updated"}))
    }else{
        response.json({"status":"Invalid ID"})
    }
})