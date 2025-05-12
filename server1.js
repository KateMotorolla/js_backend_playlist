const express = require ('express');
const {MongoClient, ObjectId} = require ('mongodb');

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));

async function getDbCollection(dbAddres, dbName, dbCollectionName) {
    const client = new MongoClient(dbAddres);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(dbCollectionName);
    return db.collection(dbCollectionName);
};

app.get('/playlist', async function(req, res){
    const collection = await getDbCollection('mongodb://127.0.0.1', 'music_library', 'playlist');
    const data = await collection.find({}).toArray();
    res.send(data);
});

app.get('/playlist/:id', async function(req, res){
    const collection = await getDbCollection('mongodb://127.0.0.1', 'music_library', 'playlist');
    const data = await collection.findOne({_id: new ObjectId (req.params.id)});
    res.send(data);
});

app.post('/playlist', async function(req, res){
    const track = {...req.body, liked: false};
    const collection = await getDbCollection('mongodb://127.0.0.1', 'music_library', 'playlist');
    await collection.insertOne(track);
    res.send(track);
});

app.patch('/playlist/:id', async function(req, res){
    const collection = await getDbCollection('mongodb://127.0.0.1', 'music_library', 'playlist');
    await collection.updateOne ({_id: new ObjectId (req.params.id)}, {'$set': req.body});
    res.send({});
});

app.delete('/playlist/:id', async function(req, res){
    const collection = await getDbCollection('mongodb://127.0.0.1', 'music_library', 'playlist');
    await collection.deleteOne ({_id: new ObjectId (req.params.id)});
    res.send({});
}); 

app.listen(port, function() {
    console.log('Server is started');
});