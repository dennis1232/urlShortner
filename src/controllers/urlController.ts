import { Request, Response } from 'express';
import { createShortUrlService, redirectToLongUrlService } from '../services/urlService';
import { handleError } from '../utils/errorHandler';

export const createShortUrl = async (req: Request, res: Response) => {
    const baseUrl = process.env.BASE_URL;

    const { longUrl, expiresInDays } = req.body;

    try {
        const url = await createShortUrlService(longUrl, expiresInDays, baseUrl!);
        return res.json(url);
    } catch (err) {
        const error = handleError(err as Error)
        return res.status(error.status).json(error.message);
    }
};

export const redirectToLongUrl = async (req: Request, res: Response) => {
    const { code } = req.params;

    try {
        const url = await redirectToLongUrlService(code);

        return res.redirect(url.longUrl);
    } catch (err) {
        const { status, message } = handleError(err as Error)
        return res.status(status).json({ message });
    }
};
