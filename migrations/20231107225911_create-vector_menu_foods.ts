import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("vector_menu_foods", (table) => {
        table.increments();
        table.string("food_name").notNullable().unique();
        table.string("cook");
        table.string("food_ingredient_a");
        table.string("food_ingredient_b");
        table.string("food_ingredient_c");
        table.string("food_ingredient_d");
        table.string("sauce");
        table.foreign("menu_foods_id").references("id").inTable("menu_foods");
        table.timestamps(false, true);
    });
    await knex.schema.createTable("vector_menu_drinks", (table) => {
        table.increments();
        table.string("drink_name").notNullable().unique();
        table.string("drink_status");
        table.string("drink_ingredient_a");
        table.string("drink_ingredient_b");
        table.foreign("menu_drinks_id").references("id").inTable("menu_drinks");
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("vector_menu_drinks");
    await knex.schema.dropTable("vector_menu_foods");
}

