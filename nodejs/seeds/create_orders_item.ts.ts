import { Knex } from "knex";
import xlsx from "xlsx" ;
import path from "path";
import { SheetData } from "../model";



export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("orders_items").del();

    const workbook = xlsx.readFile(
        path.join(__dirname,"..","data","Orders_item.xlsx")
    )
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let jsonData = xlsx.utils.sheet_to_json(worksheet) as SheetData[];
    const newJsonData = jsonData.map((row) => {
        const orders_item = row.order_id;
        return {
          order_id: orders_item,
          food_id: row.food_id|| 1,// need to connect with the id of menu_food
          drink_id: row.drink_id || 1,// need to connect with the id of menu_drink
          quantity:row.quantity,
        };
    })



    // Inserts seed entries
    await knex("orders_items").insert(newJsonData);
    console.log("Data successfully inserted")
};
