const reader = require('xlsx')
const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(db => console.log("DB Connected"))
  .catch(err => console.error(err))

function isNumeric(s) {
   return !isNaN(s - parseFloat(s));
}

const file = reader.readFile('./PAGO MENSUAL SELECTHEALTH.xlsx')

const newfile = reader.readFile('./clientes.xlsx')

let data = []

let newdata = []
  
const sheets = file.SheetNames

const newsheets = newfile.SheetNames
  
for(let i = 0; i < sheets.length; i++)
{
   const temp = reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]])
   temp.forEach((res) => {
      data.push(res)
   })
}
  
for(let i = 0; i < newsheets.length; i++)
{
   const temp = reader.utils.sheet_to_json(
      newfile.Sheets[newfile.SheetNames[i]])
   temp.forEach((res) => {
      newdata.push(res)
   })
}

const exclient = require("./models.js")

const exowner = require("./second_model.js")
// Printing data
//all data is saved in JSON format
//we must push said data to a MYSQL db
//Then, run the required calculations and print an excel file
//console.log(data)

//console.log(newdata)

data.forEach(element => {
   //At this point, we insert this data into the database
   console.log(element/*['ARRANGEMENT NAME']*/);
   /**
    * fields:
    * ARRANGEMENT NAME
    * ARRANGEMENT ID
    * PREMIUM MONTH
    * MEMBER COUNT
    */
   //We create an object and store the data
   let amnt = (isNumeric(element['MEMBER COUNT'])) ? element['MEMBER COUNT'] : 0;

   const clnt = new exclient({
      name: element['ARRANGEMENT NAME'],
      document_id: element['ARRANGEMENT ID'],
      amount: amnt,
      date: element['PREMIUM MONTH'] //We need to transform the numbers received into a readable string
    });
    
    //We store the data, rinse and repeat 
    console.log('Inserted successfully');
    clnt.save();
});

newdata.forEach(element => {

   console.log(element/*['ARRANGEMENT NAME']*/);

   let amnt = (isNumeric(element['L'])) ? element['L'] : 0;
   let idperson = (element['MEMBER ID']) ? element['MEMBER ID'] * 1000 + 1 : 0

   const ownclnt = new exowner({
      name: element['NOMBRE'],
      second_name: element['APELLIDO'],
      document_id: idperson,
      amount: amnt
   })

   console.log('Inserted successfully');
   ownclnt.save();
});