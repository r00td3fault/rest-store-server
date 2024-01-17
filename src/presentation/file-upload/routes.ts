import { Router } from "express";
import { UploadFileController } from "./controller";
import { UploadFileService } from "../services/upload-file.service";
import { TypeMiddleware, UploadFileMiddleware } from "../middlewares";




export class UploadFileRoutes {

    static get routes(): Router {

        const router = Router();

        const uploadService = new UploadFileService();
        const controller = new UploadFileController(uploadService);

        const validTypes = ['users', 'products', 'categories'];


        router.use(TypeMiddleware.validTypes(validTypes));
        router.use(UploadFileMiddleware.containFiles);

        router.post('/single/:type', controller.uploadFile);
        router.post('/multiple/:type', controller.uploadMultipleFiles);

        return router;
    }
}