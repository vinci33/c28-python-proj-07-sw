export interface SheetData {
  [sheetName: string]: any[]; // Replace 'any[]' with the desired type for the sheet data
}

export interface MenuItem {
  id: number;
  food_name: string;
  food_price: number;
  food_image: string;
}