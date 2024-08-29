const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const playerSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number, 
        required: true
    },
    token: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;



