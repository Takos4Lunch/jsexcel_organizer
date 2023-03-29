//Setting database connection and require for xlsx and mongoose
const reader = require('xlsx')
const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(db => console.log("DB Connected"))
  .catch(err => console.error(err))

  const exclient = require("./models.js")

  const exowner = require("./second_model.js")

//We set up a function to revert the date to a readable format

const excelEpoc = new Date(1900, 0, -1).getTime();
const msDay = 86400000;

function excelDateToJavascript(excelDate) {
  return  new Date(excelEpoc + excelDate * msDay);
}

//Function to check if input is a number or not
function isNumeric(s) {
   return !isNaN(s - parseFloat(s));
}

//We read the file and extract the data

const file = reader.readFile('./PAGO MENSUAL SELECTHEALTH.xlsx')

let data = []
  
const sheets = file.SheetNames
  
for(let i = 0; i < sheets.length; i++)
{
   const temp = reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]])
   temp.forEach((res) => {
      data.push(res)
   })
}
 
//New data sheet
const newfile = reader.readFile('./clientes.xlsx')

let newdata = []
  
const newsheets = newfile.SheetNames
  
for(let i = 0; i < newsheets.length; i++)
{
   const temp = reader.utils.sheet_to_json(
      newfile.Sheets[newfile.SheetNames[i]])
   temp.forEach((res) => {
      newdata.push(res)
   })
}

// Printing data
//all data is saved in JSON format
//we must push said data to a MYSQL db
//Then, run the required calculations and print an excel file
//console.log(data)

//console.log(newdata)

// data.forEach(element => {
//    //At this point, we insert this data into the database
//    console.log(element/*['ARRANGEMENT NAME']*/);
//    /**
//     * fields:
//     * ARRANGEMENT NAME
//     * ARRANGEMENT ID
//     * PREMIUM MONTH
//     * MEMBER COUNT
//     */
//    //We create an object and store the data
//    let amnt = (isNumeric(element['MEMBER COUNT'])) ? element['MEMBER COUNT'] : 0;

//    const clnt = new exclient({
//       name: element['ARRANGEMENT NAME'],
//       document_id: element['ARRANGEMENT ID'],
//       amount: amnt,
//       date: element['PREMIUM MONTH'] //We need to transform the numbers received into a readable string
//     });
    
//     //We store the data, rinse and repeat 
//     console.log('Inserted successfully');
//     clnt.save();
// });

// newdata.forEach(element => {

//    console.log(element/*['ARRANGEMENT NAME']*/);

//    let amnt = (isNumeric(element['L'])) ? element['L'] : 0;
//    let idperson = (element['MEMBER ID']) ? element['MEMBER ID'] * 1000 + 1 : 0

//    const ownclnt = new exowner({
//       name: element['NOMBRE'],
//       second_name: element['APELLIDO'],
//       document_id: idperson,
//       amount: amnt
//    })

//    console.log('Inserted successfully');
//    ownclnt.save();
//   })

//Now, we request all the entries that have a reflection on the other collection
//Then print it to an excel document

const lastfile = reader.readFile('./test_final.xlsx')

//We need to get the Ids first
//Then, we do the query as we intended before
let idscollection;

// let ids = exowner.find({},{_id: false, __v: false,name: false, second_name:false,amount: false},{}).exec().then((result) => { 
//    //idscollection = JSON.parse(idscollection)
//    var docs = []
//    result.forEach(element => {
//       docs.push((element['document_id']*1000+1))
//    })
//    console.log(docs)
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

   let results = exclient.find( { /*document_id : { $nin : docs }*/},{ /*_id: false, __v: false*/},[ { $lookup: { from: "exowners", localField: "document_id", foreignField: "document_id", as: "registered" } }]).exec().then((result)=>{
      console.log(result)
      let obtained = JSON.stringify(result);
      let transformed = JSON.parse(obtained);
      
      //console.log(transformed)
      //console.log(transformed)
      // result.forEach(element => {
      //    console.log(element)//Now we have the results, time to print them
      // });
      // const ws = reader.utils.json_to_sheet(transformed)
      // reader.utils.book_append_sheet(lastfile,ws,"Hoja 2")
     
      // // Writing to our file
      // reader.writeFile(lastfile,'./test.xlsx')
   });
// })

[ { $lookup: { from: "exowners", localField: "document_id", foreignField: "document_id", as: "registered" } }, {$match: {registered:[]} }]