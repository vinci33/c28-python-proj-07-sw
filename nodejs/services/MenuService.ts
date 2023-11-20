import { Knex } from "knex";

export class MenuService {
    constructor(private knex: Knex) {

    }

    async getMenus() {
        const result = await this.knex("menu_foods").select("*");
        return result;
    }

    async postOrder(food_id: number, drink_id: number, quantity: number) {

        // const id  = await this.knex("order")
        const customer_id = await this.knex("customers").insert(
            {
                table_id: 1
            }).returning("id")
        // console.log(customer_id)
        const customerId = customer_id[0].id
        // console.log(customerId)
        const orderId = await this.knex("orders").insert({
            customer_id: customerId,
        }).returning("id")

        // console.log({
        //     orderId
        // })
        const orderItemId = await this.knex("orders_items").insert({
            order_id: orderId[0].id,
            food_id: food_id,
            drink_id: drink_id,
            quantity: quantity
        }).returning("id")
        return orderItemId
    }
}