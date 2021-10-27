const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = 5000;

// Middleware
// This is improtent
app.use(cors())
app.use(express.json())

// MongoDB 
const uri = `mongodb+srv://geniusMechanic:OpIncAtL6HVkDiaY@cluster0.wq4ks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wq4ks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// async Function
async function run() {

    // 1st
    try {
        await client.connect();
        const database = client.db('carMechanic');
        const serviceCollection = database.collection('services');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        })


        // GET Single SERVICE API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Getting id', id)
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })



        // POST API
        app.post('/services', async (req, res) => {

            const service = req.body;

            const result = await serviceCollection.insertOne(service);
            console.log(result)
            console.log('Hit the Service PORT', service)

            // res.send('post Hitted')
            res.json(result)

        })
        // console.log('Connected to Database');

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result)
        })
    }
    // 2nd
    finally {
        // await client.close()
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('This is Node-JS Server');
});

app.listen(port, () => {
    console.log('Running Server ', port);
});