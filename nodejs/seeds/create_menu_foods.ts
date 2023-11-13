import { Knex } from "knex";
import xlsx from "xlsx";
import path from "path";
import { SheetData } from "../model";
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("menu_foods").del();

  try {
    // Read the Excel file
    const workbook = xlsx.readFile(
      path.join(__dirname, "..", "data", "Menu_foods1.xlsx")
    );
    //  console.log(workbook)
    // Get the worksheet by its index or name
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    //   console.log(worksheet)
    // Convert the worksheet to JSON
    let jsonData = xlsx.utils.sheet_to_json(worksheet) as SheetData[];
    //  console.log("Sheet: ", jsonData[0])

    const newJsonData = jsonData.map((row) => {
      const foodName = row.food_name;
      return {
        food_name: foodName,
        food_price: row.food_price,
        food_category: row.food_category,
        food_image: null,
      };
    });
    let foodNameSet = new Set();
    const uniqueJsonData = newJsonData.filter((row) => {
      const food_name = row.food_name;
      if (foodNameSet.has(food_name)) {
        return false; // Duplicate food_name, exclude from the array
      }
      foodNameSet.add(food_name);
      return true; // Unique food_name, include in the array
    });

    await knex.table("menu_foods").insert(uniqueJsonData);
    console.log("Data insertion completed successfully.");
  } catch (error) {
    console.error("Error while inserting data:", error);
  }
}
