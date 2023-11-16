import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("menu_foods").del();
  const foods = [
    {
      food_name: "銀芽肉絲 炒麵 ",
      food_price: 60,
      food_category: "海鮮類",
      food_image: "../public/asset/1.png"
     
    },
    {
      food_name: "菜遠魚柳炒河 ",
      food_price: 60,
      food_category: "海鮮類",
      food_image:"../public/asset/2.png"
     
    },
    {
      food_name: "美極生炒牛肉飯",
      food_price: 60,
      food_category: "海鮮類",
      food_image:"../public/asset/3.png"
     
    },
    {
      food_name: "印尼炒飯",
      food_price: 60,
      food_category: "豬肉類",
      food_image:"../public/asset/4.png"
     
    },
    {
      food_name: "泰式菠蘿海鮮炒飯 ",
      food_price: 60,
      food_category: "海鮮類",
      food_image:"../public/asset/5.png"
     
    },
    {
      food_name: "清酒炒米粉",
      food_price: 60,
      food_category: "海鮮類",
      food_image:"../public/asset/6.png"
     
    },
    {
      food_name: "星洲炒米",
      food_price: 60,
      food_category: "海鮮類",
      food_image:"../public/asset/blog-pattern-bg.png"
     
    },
    {
      food_name: "日式鰻魚炒飯 ",
      food_price: 60,
      food_category: "海鮮類",
      food_image:"../public/asset/bg_1.png"
     
    },
    {
      food_name: "乾炒牛河",
      food_price: 65,
      food_category: "牛肉類",
      food_image:"../public/asset/blog1.png"
     
    },
    {
      food_name: "楊州炒飯",
      food_price: 60,
      food_category: "豬肉類",
      food_image:"../public/asset/blog2.png"
     
    },
    {
      food_name: "西炒飯",
      food_price: 60,
      food_category: "豬肉類",
      food_image:"../public/asset/bt3.png"
     
    },
    {
      food_name: "沙爹牛肉炒可",
      food_price: 60,
      food_category: "牛肉類",
      food_image:"../public/asset/bt4.png"
     
    },
    {
      food_name: "鐵板豬扒烏冬",
      food_price: 65,
      food_category: "豬肉類",
      food_image:"../public/asset/dish1.png"
     
    },
    {
      food_name: "鐵板豬扒炒公仔麵",
      food_price: 60,
      food_category: "豬肉類",
      food_image:"../public/asset/dish2.png"
     
    },
    {
      food_name: "鐵板牛肉炒公仔麵",
      food_price: 60,
      food_category: "牛肉類",
      food_image:"../public/asset/dish3.png"
    },
    {
      food_name: "鐵板海鮮炒公仔麵",
      food_price: 60,
      food_category: "海鮮類",
      food_image:"../public/asset/dish4.png"
    },
      {
      food_name: "鐵板海鮮炒烏冬 ",
      food_price: 65,
      food_category: "海鮮類",
      food_image:"../public/asset/dish5.png"
     
    },
    {
      food_name: "榨菜肉絲炆米 ",
      food_price: 65,
      food_category: "豬肉類",
      food_image:"../public/asset/dish6.png"
     
    },
    {
      food_name: "香蔥蝦仁炒滑蛋飯 ",
      food_price: 60,
      food_category: "豬肉類",
      food_image:"../public/asset/dish7.png"
     
    },
    {
      food_name: "菜芙蓉蛋飯 ",
      food_price: 60,
      food_category: "豬肉類",
      food_image:"../public/asset/dish8.png"
    },
    
  ];
  // console.log(foods.length)
  // console.log(foods.reduce((r, f) => {
  //   r.set(f.food_name, (r.get(f.food_name) ?? 0) + 1)
  //   return r
  // }, new Map<string, number>()))
  return await knex
  .insert(foods)
  .into("menu_foods");
}
