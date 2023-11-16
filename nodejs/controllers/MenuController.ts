import { Request, Response } from "express"
import { MenuService } from "../services/MenuService"
export class MenuController {
    constructor(private menuService: MenuService) {

    }

    getMenu = async (req: Request, res: Response) => {
        const menus = await this.menuService.getMenus();
        res.json(menus);
    }

    postOrder = async (req: Request, res: Response) => {
        const userId = 1
        const foodId = req.body.foodId
        const drinkId = req.body.drinkId
        const qty = req.body.qty
        await this.menuService.postOrder(userId, foodId, drinkId, qty)
    }
}