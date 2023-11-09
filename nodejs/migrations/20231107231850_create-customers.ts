import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("customers", (table) => {
        table.increments();
        table.integer("table_id").notNullable();
        table.timestamp('entry_times').defaultTo(knex.fn.now());
        table.string("username");
        table.string("password");
        table.integer("phone");
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("customers");
}

