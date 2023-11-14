import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("orders_items").del();
  await knex("orders").del();
  await knex("menu_foods").del();
  await knex("menu_drinks").del();
  await knex("customers").del();
  await knex("restaurants_info").del();


  await knex.raw("ALTER SEQUENCE restaurants_info_id_seq RESTART WITH 1")
  await knex.raw("ALTER SEQUENCE orders_id_seq RESTART WITH 1")
  await knex.raw("ALTER SEQUENCE orders_items_id_seq RESTART WITH 1")
  await knex.raw("ALTER SEQUENCE customers_id_seq RESTART WITH 1")
  await knex.raw("ALTER SEQUENCE menu_drinks_id_seq RESTART WITH 1");
  await knex.raw("ALTER SEQUENCE menu_foods_id_seq RESTART WITH 1")

  // Inserts seed entries
  const seedData = [
    {
      table_id: 1,
      entry_times: 20231110,
      username: "Jason",
      password: "1234",
      phone: 51993416,
    },
    {
      table_id: 2,
      entry_times: 20231110,
      username: "Kenneth",
      password: "5678",
      phone: 12345678,
    },
  ];

  await knex("customers").insert(seedData);
}

