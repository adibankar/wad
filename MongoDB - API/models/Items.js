const mongoose = require('mongoose');

const Item = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type:String,
        required: true
    }
})

module.exports = mongoose.model('Item', Item)