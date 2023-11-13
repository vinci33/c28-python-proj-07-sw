import { Knex } from "knex";
import xlsx from "xlsx";
import path from "path";
import { SheetData } from "../model";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  try {
    const workbook = xlsx.readFile(
      path.join(__dirname, "..", "data", "Menu_drinks2.xlsx")
    );
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let jsonData = xlsx.utils.sheet_to_json(worksheet) as SheetData[];

    const newJsonData = jsonData.map((row) => {
      const foodName = row.drink_name;
      return {
        drink_name: foodName,
        drink_price: row.drink_price,
        drink_category: row.drink_category,
        drink_image: null,
      };
    });
    let drinkNameSet = new Set();
    const uniqueJsonData = newJsonData.filter((row) => {
      const drink_name = row.drink_name;
      if (drinkNameSet.has(drink_name)) {
        return false; // Duplicate food_name, exclude from the array
      }
      drinkNameSet.add(drink_name);
      return true; // Unique food_name, include in the array
    });

    // Inserts seed entries
    await knex.table("menu_drinks").insert(uniqueJsonData);
    console.log("Data insertion completed successfully.");
  } catch (error) {
    console.error("Error while inserting data:", error);
  }
}
