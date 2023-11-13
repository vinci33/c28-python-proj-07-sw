import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("orders_items").del();
    
    const seedData = [
        {
          order_id: 1,
        //   food_id:2,
        //   drink_id:1,
          quantity:1
        },]


    // Inserts seed entries
    await knex("orders_items").insert(seedData)
};
