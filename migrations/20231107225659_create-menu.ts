import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("menu_foods", (table) => {
        table.increments();
        table.string("food_name").notNullable().unique();
        table.integer("food_price");
        table.string("food_category");
        table.string("food_image");
        table.timestamps(false, true);
    });
    await knex.schema.createTable("menu_drinks", (table) => {
        table.increments();
        table.string("drink_name").notNullable().unique();
        table.integer("drink_price");
        table.string("drink_category");
        table.string("drink_image");
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("menu_drinks");
    await knex.schema.dropTable("menu_foods");
}

