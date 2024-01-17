import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { UploadedFile } from "express-fileupload";
import { UploadFileService } from "../services";





export class UploadFileController {

    constructor(
        private readonly uploadFileService: UploadFileService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.error(`${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    }


    uploadFile = (req: Request, res: Response) => {

        const type = req.params.type;
        const file = req.body.files.at(0) as UploadedFile;

        this.uploadFileService.uploadSingle(file, `uploads/${type}`)
            .then(uploaded => res.json(uploaded))
            .catch((error) => this.handleError(error, res));
    }

    uploadMultipleFiles = (req: Request, res: Response) => {

        const type = req.params.type;
        const files = req.body.files as UploadedFile[];

        this.uploadFileService.uploadMultiple(files, `uploads/${type}`)
            .then(uploaded => res.json(uploaded))
            .catch((error) => this.handleError(error, res));
    }
}