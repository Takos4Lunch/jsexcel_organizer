const mongoose = require("mongoose")
const {Schema} = mongoose

const exowner = new Schema({
    name: { type: String},
    second_name: { type: String},
    document_id: {type: Number, default: 0},
    amount: {type: Number, default: 0}
})

module.exports = mongoose.model("exowner", exowner)