import { NextFunction, Request, Response } from "express";


export class TypeMiddleware {

    static validTypes(validTypes: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            const urlSplit = req.url.split('/');
            const indexImagePath = urlSplit.findIndex(element => element.includes('.'));

            if (indexImagePath !== -1) urlSplit.pop();

            const UrlLength = urlSplit.length - 1;

            const type = urlSplit.at(UrlLength) ?? '';

            if (!validTypes.includes(type)) {
                return res.status(400).json({ error: `Invalid type ${type} valid ones ${validTypes}` });
            }

            next();

        }
    }
}