import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("orders", (table) => {
        table.increments();
        table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
        table.integer("customer_id").unsigned().notNullable().references("id").inTable("customers").onDelete("CASCADE").onUpdate("CASCADE");
        table.integer("food_id").unsigned().references("id").inTable("menu_foods").onDelete("CASCADE").onUpdate("CASCADE");
        table.integer("drink_id").unsigned().references("id").inTable("menu_drinks").onDelete("CASCADE").onUpdate("CASCADE");
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("orders");
}

