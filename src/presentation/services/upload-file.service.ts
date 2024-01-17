import { UploadedFile } from "express-fileupload";
import { UuidAdapter } from "../../config";
import fs from 'fs';
import { CustomError } from "../../domain";
import path from "path";



export class UploadFileService {

    constructor(
        private readonly uuid = UuidAdapter.v4
    ) { }

    private checkFolder(folderPath: string) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
    }

    async uploadSingle(
        file: UploadedFile,
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ) {

        try {

            const fileExtension = file.mimetype.split('/').at(1) ?? '';

            if (!validExtensions.includes(fileExtension)) {
                throw CustomError.badRequest(`Invalid extension: ${fileExtension}`);
            }

            const destination = path.resolve(__dirname, '../../../', folder);
            this.checkFolder(destination);

            const fileName = `${this.uuid()}.${fileExtension}`;

            file.mv(`${destination}/${fileName}`);

            return { fileName };

        } catch (error) {
            console.log(error);
        }
    }

    async uploadMultiple(
        files: UploadedFile[],
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ) {

        const filenames = await Promise.all(
            files.map(file => this.uploadSingle(file, folder, validExtensions))
        );

        return filenames;

    }

}