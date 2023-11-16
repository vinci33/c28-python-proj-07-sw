import express from 'express'
import { MenuController } from './controllers/MenuController';
import { MenuService } from './services/MenuService';
import { knex } from './knex';


export const routes = express.Router()

const menuService = new MenuService(knex);
const menuController = new MenuController(menuService);

routes.get('/loadMenu', menuController.getMenu) // http://localhost:8080/menus
// routes.get('/test', openaiController.test)

routes.post('/postOrder', menuController.postOrder) // http://localhost:8080/menus