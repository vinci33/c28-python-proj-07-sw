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

            const foodId = req.body.food_id
            const drinkId = req.body.drink_id
            const qty = req.body.quantity
            // console.log({ foodId, drinkId, qty })
            const orderItemId = await this.menuService.postOrder(foodId, drinkId, qty)
            // console.log(orderItemId)
            res.json(orderItemId)
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: 'An error occurred while posting the order.' });
        }
    }
} 
