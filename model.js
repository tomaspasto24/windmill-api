const mongoose = require('mongoose');

const pieceSchema = new mongoose.Schema({
    id: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    photo: {
        required: true,
        type: String
    },
    airResistance: {
        require: true,
        type: Number
    },
    material: {
        require: true,
        type: String
    },
})

module.exports = mongoose.model('Data', pieceSchema)