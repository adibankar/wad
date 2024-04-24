const express = require('express');
const connectToMongoDb = require('./database');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const PORT = 3000

connectToMongoDb;

app.use('/auth', require('./routes/auth'));
app.use('/quizz', require('./routes/quizz'));
app.use('/attemptquizz', require('./routes/quizzattempts'));

app.listen(PORT, ()=>{
    console.log('Server is running on Port ', PORT)
})