import knex, { Knex } from "knex";

// export async function seed(knex: Knex): Promise<void> {
  export async function seed(knex: Knex): Promise<void> {
  await knex("restaurants_info").del();
  

  // Reset the id_seq with knex
  // await knex.raw('ALTER SEQUENCE students_id_seq RESTART WITH 1');
  // await knex.raw('ALTER SEQUENCE teachers_id_seq RESTART WITH 1');

  const [{ id }]: Array<{ id: number }> = await knex
    .insert({
      name: "RED TEA CAFE",
      address: "Shop 5, G/F, Hang Send Tsim Sha Tsui Building, 18 Carnarvon Road, Tsim Sha Tsui",
      phone:51993416,
      website: "https://jasonrobinyim.xyz/",
      email:"jason20210106@gmail.com",
      working_hours:9002230,
      image:null

    })
    .into("restaurants_info")
    .returning("id");

  //  await knex
  //   .insert({
  //     name: "RED TEA CAFE",
  //     address: "Shop 5, G/F, Hang Send Tsim Sha Tsui Building, 18 Carnarvon Road, Tsim Sha Tsui",
  //     phone:51993416,
  //     website: "https://jasonrobinyim.xyz/",
  //     email:"jason20210106@gmail.com",
  //     working_hours:9002230,
  //     image:null

  //   })
  //   .into("restaurants_info")
  //   .returning("id");

  //  await knex
  //   .insert([
  //     {
  //       name: "RED TEA CAFE",
  //       address: "Shop 5, G/F, Hang Send Tsim Sha Tsui Building, 18 Carnarvon Road, Tsim Sha Tsui",
  //       phone:51993416,
  //       website: "https://jasonrobinyim.xyz/",
  //       email:"jason20210106@gmail.com",
  //       working_hours:9002230,
  //       image:null
  //     },
      
  //   ])
  //   .into("restaurants_info");
}

// return await knex
// .insert([
//   {
//     food_name: "Peter",
//     food_price: 25,
//     food_category: "1995-05-15",
//     food_image: id,
//   }]).into("menu_foods")}
