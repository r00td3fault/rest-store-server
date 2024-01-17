import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { CategoryRoutes } from "./category/routes";
import { ProductRoutes } from './products/routes';
import { UploadFileRoutes } from "./file-upload/routes";
import { ImagesRoutes } from "./images/routes";

export class AppRoutes {

    static get routes(): Router {

        const router = Router();

        //rutas
        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/categories', CategoryRoutes.routes);
        router.use('/api/products', ProductRoutes.routes);
        router.use('/api/upload', UploadFileRoutes.routes);
        router.use('/api/images', ImagesRoutes.routes);

        return router;
    }
}