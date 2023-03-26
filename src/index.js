const reader = require('xlsx')

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
  
// Printing data
//all data is saved in JSON format
//we must push said data to a MYSQL db
//Then, run the required calculations and print an excel file
console.log(data)