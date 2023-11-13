// import * as fs from 'fs'
// import { Pool } from 'pg';
// import * as xlsx from 'xlsx' 
//  import { SheetData } from './model';
// import path from 'path';

// // import { openaiController } from './main';

// // export const workbooks = xlsx.readFile(path.join(__dirname, "", "data", "Vector_menu.xlsx"));
// // const sheetNames = Object.keys(workbooks.Sheets);

// const pool = new Pool({
//    database: process.env.DB_NAME,
//    user: process.env.DB_USER,
//    password: process.env.DB_PASSWORD,
//    port:parseInt(process.env.DB_PORT||"5432"),
// }) 

// export async function insertData(){
//    const workbook = xlsx.readFile(path.join(__dirname, "", "data", "Vector_menu.xlsx"));
//    const worksheet1 = workbook.Sheets[workbook.SheetNames[0]];
//    const worksheet2 = workbook.Sheets[workbook.SheetNames[1]];
//    const jsonData = xlsx.utils.sheet_to_json(worksheet1);
//    const client = await pool.connect();
   
//    try {
//       for (const row of jsonData) {
//         // Customize the SQL query based on your table structure
//         const query = `
//           INSERT INTO your_table (column1, column2, column3,column4,column5,column6,column7,column8,)
//           VALUES ($1, $2, $3)
//         `;
//         const values = [row.column1, row.column2, row.column3];
  
//         await client.query(query, values);
//       }
//     } finally {
//       client.release();
//     }

// } 
// insertData()
//   .then(() => {
//     console.log('Data insertion completed successfully.');
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error('Error while inserting data:', error);
//     process.exit(1);
//   });
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import xlsx from 'xlsx';
import { SheetData } from './model';

// Create a pool for connecting to the PostgreSQL database
const pool = new Pool({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function insertData() {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile(path.join(__dirname, 'data', 'Vector_menu.xlsx'));

    // Get the worksheet by its index or name
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert the worksheet to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet) as SheetData[];

    // Connect to the database
    const client = await pool.connect();

    try {
      for (const row of jsonData) {
        // Customize the SQL query based on your table structure
        const query = `
          INSERT INTO your_table (column1, column2, column3, column4, column5, column6, column7, column8)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
  
        const values = [
          row.column1,
          row.column2,
          row.column3,
          row.column4,
          row.column5,
          row.column6,
          row.column7,
          row.column8,
        ];

        await client.query(query, values);
      }
    } finally {
      // Release the database connection
      client.release();
    }
    
    console.log('Data insertion completed successfully.');
  } catch (error) {
    console.error('Error while inserting data:', error);
  }
}

insertData().finally(() => {
  // Close the database pool
  pool.end();
});