import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("orders", (table) => {
        table.increments();
        table.integer("customer_id").unsigned().notNullable().references("id").inTable("customers")
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("orders");
}

