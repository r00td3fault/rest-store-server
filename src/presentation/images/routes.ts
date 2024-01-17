import { Router } from 'express';
import { ImagesController } from './controller';
import { TypeMiddleware } from '../middlewares/type.middleware';





export class ImagesRoutes {


    static get routes(): Router {

        const router = Router();
        const controller = new ImagesController();

        const validTypes = ['users', 'products', 'categories'];
        router.use(TypeMiddleware.validTypes(validTypes));


        router.get('/:type/:img', controller.getImage);

        return router;
    }


}