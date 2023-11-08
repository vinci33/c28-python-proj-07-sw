import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.increments();
        table.string("username").notNullable().unique();
        table.string("email").notNullable().unique();
        table.integer("user_phone").notNullable().unique();
        table.string("password").notNullable();
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("users");
}

