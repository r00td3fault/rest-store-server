import { Request, Response } from "express";
import { CustomError } from "../../domain";
import fs from "fs";
import path from "path";



export class ImagesController {

    // DI
    constructor(
        // private readonly uploadFileService: UploadFileService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.error(`${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    getImage = (req: Request, res: Response) => {
        const { type = '', img = '' } = req.params;

        const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${img}`);
        if (!fs.existsSync(imagePath)) return res.status(404).json({ error: 'Image not found' });

        res.sendFile(imagePath);

    }

}