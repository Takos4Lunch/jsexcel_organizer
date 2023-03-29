const mongoose = require("mongoose")
const {Schema} = mongoose

const exclient = new Schema({
    name: { type: String},
    document_id: {type: Number, default: 0},
    amount: {type: Number, default: 0},
    date: {type: String},
    timestamp: {type: Date, default: Date.now}
})

module.exports = mongoose.model("exclient", exclient)