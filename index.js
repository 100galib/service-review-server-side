const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w7wfspi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })



const run = async () => {
    try{
        const allServices = client.db('Service-Review').collection('allservices');
        const messageCollection = client.db('Service-Review').collection('reviewSection')
        
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '8h'})
            res.send({token})
        })

        app.get('/service', async(req, res) => {
            const query = {};
            const cursor = allServices.find(query);
            const singleService = await cursor.toArray();
            res.send(singleService);
        })
        app.get('/serviceShort', async(req, res) => {
            const query = {};
            const cursor = allServices.find(query);
            const singleService = await cursor.limit(3).toArray();
            res.send(singleService);
        })
        app.post('/service', async(req, res)=> {
            const message = req.body;
            const result = await allServices.insertOne(message);
            res.send(result)
        })
        app.get('/service/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await allServices.findOne(query);
            res.send(service);
        })
        app.get('/message', async(req, res) => {
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = messageCollection.find(query);
            const singleMessage = await cursor.toArray();
            res.send(singleMessage); 
        })

        app.post('/message', async(req, res)=> {
            const message = req.body;
            const result = await messageCollection.insertOne(message);
            res.send(result)
        })

        app.delete('/message/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await messageCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(err => console.log('error', err));

app.get('/', (req, res) => {
    res.send('Backend Server is Running');
})


app.listen(port, () => {
    console.log(`listening to the ${port}`)
})