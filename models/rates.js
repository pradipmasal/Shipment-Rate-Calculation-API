const mongoose = require('mongoose')


const ratesSchema = new mongoose.Schema({
    source:{
        type: String,
        required: true
    },
    destination:{
        type: String,
        required: true
    },
    rate:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('rates', ratesSchema);