import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("customers").del();

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

