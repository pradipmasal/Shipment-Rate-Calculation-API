const mongoose = require('mongoose')

const cityBlockSchema = new mongoose.Schema({
    block: {
        type: String,
        required: true
    },
    cities: [{
        type: String //array
    }]
});



module.exports = mongoose.model('city-blocks', cityBlockSchema);