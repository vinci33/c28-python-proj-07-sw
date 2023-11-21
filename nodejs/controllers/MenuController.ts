import { Request, Response } from "express"
import expressSession from 'express-session';
import { MenuService } from "../services/MenuService"
export class MenuController {
    constructor(private menuService: MenuService) {

    }

    getMenu = async (req: Request, res: Response) => {
        try {
            const menus = await this.menuService.getMenus();
            res.json(menus);
        } catch (err) {
            console.error(err);
            res.status(400).json({ success: false, msg: "unable to get menu" });
        }
    }

    postOrder = async (req: Request, res: Response) => {
        try {
            const tableId = req.body.table_id
            const foodId = req.body.food_id
            const drinkId = req.body.drink_id
            const qty = req.body.quantity
            console.log({ tableId, foodId, drinkId, qty })
            const orderItemId = await this.menuService.postOrder(tableId, foodId, drinkId, qty)
            console.log(orderItemId)
            res.json(orderItemId[0])
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: 'An error occurred while posting the order.' });
        }
    }

    getOrderedDetails = async (req: Request, res: Response) => {
        try {
            const foodIds = (req.query.food_ids as string).split(',').map(Number)
            // console.log(foodIds)
            const orderedDetails = await this.menuService.getOrderedDetails(foodIds);
            // console.log(orderedDetails)
            res.json(orderedDetails);
        } catch (err) {
            console.error(err);
            res.status(400).json({ success: false, msg: "unable to get menu" });
        }
    }
} 
