import { Router } from "express";
import { CategoryService } from "../services";
import { CategoryController } from "./controller";
import { AuthMiddleware } from "../middlewares";




export class CategoryRoutes {

    static get routes(): Router {

        const router = Router();

        const categoryService = new CategoryService();
        const controller = new CategoryController(categoryService);

        router.get('/', controller.getCategories);
        router.post('/', [AuthMiddleware.validateJwt], controller.createCategory);

        return router;
    }
}