const express = require('express');
const mongoose = require('mongoose')
const Itmes = require('./models/Items');
const Items = require('./models/Items');
const app = express();
const port = 3000;

// Connection URI
const uri = 'mongodb://127.0.0.1:27017/mongo-api';

mongoose.connect(uri).then(()=>{
    console.log('Connected to MongoDb');
}).catch(error => {
    console.log(error)
})

// Middleware
app.use(express.json()); // Parse JSON bodies

// Routes
app.get("/", (req, res) => {
    console.log('Home')
    res.sendFile(__dirname + '/public/index.html');
});

// GET all items
app.get("/items", async (req, res) => {
    const items = await Items.find();
    res.json(items);    
});

// GET single item
app.get("/items/:id", async (req, res) => {
    const item = await Items.findOne({_id: req.params.id});
    res.json(item);
});

// POST new item
app.post("/items", async (req, res) => {
    const items = req.body;

    console.log(items);

    const result = await Items.create(items);

    res.json(result);
});

// PUT update item
app.put("/items/:id", async (req, res) => {
    const items = req.body;

    const result = await Items.findByIdAndUpdate({_id: req.params.id}, items, {new: true})
    res.json(result);
});

// DELETE item
app.delete("/items/:id", async (req, res) => {
    const result = await Items.findByIdAndDelete({_id: req.params.id});
    res.json(result);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
