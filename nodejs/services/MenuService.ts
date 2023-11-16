import { Knex } from "knex";

export class MenuService {
    constructor(private knex: Knex) {

    }

    async getMenus() {
        const result = await this.knex("menu_foods").select("*");
        return result;
    }

    async postOrder(userId: number, food_id: number, drink_id: number, quantity: number) {
        // const id  = await this.knex("order")
        const orderId = await this.knex("order").insert({
            customer_id: userId
        }).returning("id")

        console.log({
            orderId
        })
        const orderItemId = await this.knex("orders_items").insert({
            order_id: orderId,
            food_id,
            drink_id,
            quantity
        })
        return orderItemId
    }
}