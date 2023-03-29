const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(db => console.log("DB Connected"))
  .catch(err => console.error(err))

const exclient = require("./models.js")

const exowner = require("./second_model.js")

let agg = exowner.aggregate([
  {
    $lookup:
      {
        from: "exclients",
        localField: "document_id",
        foreignField: "document_id",
        as: "registered"
      }
 }
]).exec();

agg.then(console.log(agg));

const clnt = new exclient({
  name: "Pedro",
  document_id: "69",
  amount: "12",
  date: "01/2022"
});

clnt.save(); 

const exwn = new exowner({
  name: "Pedro",
  second_name: "Pedro",
  document_id: "12",
  amount: 10
})

exwn.save();

db.exowners.aggregate([
  {
    $lookup:
      {
        from: "exclients",
        localField: "document_id",
        foreignField: "document_id",
        as: "registered"
      }
 }
])