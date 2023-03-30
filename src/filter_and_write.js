const reader = require('xlsx')
const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(db => console.log("DB Connected"))
  .catch(err => console.error(err))

  const lastfile = reader.readFile('./test_final.xlsx')

  const exowner = require("./second_model.js")

   exowner.aggregate([ { $lookup: { from: "exclients", localField: "document_id", foreignField: "document_id", as: "registered" } }, {$match: {registered:[]} }]).exec().then((result) =>{
      let jhon = 0;
      let toexcel = [];
      result.forEach(element =>{
         let arrelement = {
            nombre : element['name'],
            documento: element['document_id'],
            cantidad: element['amount']//,
            //fecha: element['date']
         }

         toexcel.push(arrelement)
      })
      console.log(result);
      //Finally, we have what we needed
      const ws = reader.utils.json_to_sheet(toexcel)
      reader.utils.book_append_sheet(lastfile,ws,"Hoja 1")
     
      //Writing to our file
      reader.writeFile(lastfile,'./test_final.xlsx')
   })