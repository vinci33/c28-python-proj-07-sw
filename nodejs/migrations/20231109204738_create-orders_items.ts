import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("orders_items", (table) => {
        table.increments();
        table.integer("order_id").unsigned().notNullable().references("id").inTable("orders");
        table.integer("food_id").unsigned().references("id").inTable("menu_foods");
        table.integer("drink_id").unsigned().references("id").inTable("menu_drinks");
        table.integer("quantity");
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("orders_items");
}


