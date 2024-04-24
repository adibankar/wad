const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizzSchema = new Schema({
    quizzId: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
});


module.exports = mongoose.model('quizz', QuizzSchema);
