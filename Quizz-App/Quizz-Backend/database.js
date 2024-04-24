const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost:27017/quizz';

const connectToMongoDb = async ()=>{
    await mongoose.connect(mongoUri).then(()=>{
        console.log('Connected to MongoDB');
    }).catch((error)=>{
        console.log('Some Error Occured');
    });
}
module.exports = connectToMongoDb();