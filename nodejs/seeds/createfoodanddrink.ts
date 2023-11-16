import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("menu_foods").del();
  const foods = [
    {
      food_name: "銀芽肉絲 炒麵 ",
      food_price: 60,
      food_category: "海鮮類",
      food_image: "/asset/1.png"
    },
    {
      food_name: "菜遠魚柳炒河 ",
      food_price: 60,
      food_category: "海鮮類",
      food_image: "/asset/2.png"

    },
    {
      food_name: "美極生炒牛肉飯",
      food_price: 60,
      food_category: "海鮮類",
      food_image: "/asset/3.png"

    },
    {
      food_name: "印尼炒飯",
      food_price: 60,
      food_category: "豬肉類",
      food_image: "/asset/4.png"

    },
    {
      food_name: "泰式菠蘿海鮮炒飯 ",
      food_price: 60,
      food_category: "海鮮類",
      food_image: "/asset/5.png"

    },
    {
      food_name: "清酒炒米粉",
      food_price: 60,
      food_category: "海鮮類",
      food_image: "/asset/6.png"

    },
    {
      food_name: "星洲炒米",
      food_price: 60,
      food_category: "海鮮類",
      food_image: "/asset/dish8.jpg"

    },
    {
      food_name: "日式鰻魚炒飯 ",
      food_price: 60,
      food_category: "海鮮類",
<<<<<<< HEAD
      food_image:"/asset/bg_1.jpg"
     
=======
      food_image: "/asset/bg_1.jpg"

>>>>>>> master
    },
    {
      food_name: "乾炒牛河",
      food_price: 65,
      food_category: "牛肉類",
<<<<<<< HEAD
      food_image:"/asset/blog1.jpg"
     
=======
      food_image: "/asset/blog1.jpg"

>>>>>>> master
    },
    {
      food_name: "楊州炒飯",
      food_price: 60,
      food_category: "豬肉類",
<<<<<<< HEAD
      food_image:"/asset/blog2.jpg"
     
=======
      food_image: "/asset/blog2.jpg"

>>>>>>> master
    },
    {
      food_name: "西炒飯",
      food_price: 60,
      food_category: "豬肉類",
<<<<<<< HEAD
      food_image:"/asset/bt3.jpg"
     
=======
      food_image: "/asset/bt3.jpg"

>>>>>>> master
    },
    {
      food_name: "沙爹牛肉炒可",
      food_price: 60,
      food_category: "牛肉類",
<<<<<<< HEAD
      food_image:"/asset/bt4.jpg"
     
=======
      food_image: "/asset/bt4.jpg"

>>>>>>> master
    },
    {
      food_name: "鐵板豬扒烏冬",
      food_price: 65,
      food_category: "豬肉類",
<<<<<<< HEAD
      food_image:"/asset/dish1.jpg"
     
=======
      food_image: "/asset/dish1.jpg"

>>>>>>> master
    },
    {
      food_name: "鐵板豬扒炒公仔麵",
      food_price: 60,
      food_category: "豬肉類",
<<<<<<< HEAD
      food_image:"/asset/dish2.jpg"
     
=======
      food_image: "/asset/dish2.jpg"

>>>>>>> master
    },
    {
      food_name: "鐵板牛肉炒公仔麵",
      food_price: 60,
      food_category: "牛肉類",
<<<<<<< HEAD
      food_image:"/asset/dish3.jpg"
=======
      food_image: "/asset/dish3.jpg"
>>>>>>> master
    },
    {
      food_name: "鐵板海鮮炒公仔麵",
      food_price: 60,
      food_category: "海鮮類",
<<<<<<< HEAD
      food_image:"/asset/dish4.jpg"
=======
      food_image: "/asset/dish4.jpg"
>>>>>>> master
    },
    {
      food_name: "鐵板海鮮炒烏冬 ",
      food_price: 65,
      food_category: "海鮮類",
<<<<<<< HEAD
      food_image:"/asset/dish5.jpg"
     
=======
      food_image: "/asset/dish5.jpg"

>>>>>>> master
    },
    {
      food_name: "榨菜肉絲炆米 ",
      food_price: 65,
      food_category: "豬肉類",
<<<<<<< HEAD
      food_image:"/asset/dish6.jpg"
     
=======
      food_image: "/asset/dish6.jpg"

>>>>>>> master
    },
    {
      food_name: "香蔥蝦仁炒滑蛋飯 ",
      food_price: 60,
      food_category: "豬肉類",
<<<<<<< HEAD
      food_image:"/asset/dish7.jpg"
     
=======
      food_image: "/asset/dish7.jpg"

>>>>>>> master
    },
    {
      food_name: "菜芙蓉蛋飯 ",
      food_price: 60,
      food_category: "豬肉類",
<<<<<<< HEAD
      food_image:"/asset/dish8.jpg"
=======
      food_image: "/asset/dish8.jpg"
>>>>>>> master
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
