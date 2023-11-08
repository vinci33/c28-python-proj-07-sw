import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("restaurants_info", (table) => {
        table.increments();
        table.string("name").notNullable().unique();
        table.string("address");
        table.integer("phone");
        table.string("website");
        table.string("email");
        table.integer("working_hours");
        table.string("image");
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("restaurants_info");
}

