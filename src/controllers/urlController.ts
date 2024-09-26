import { Request, Response } from 'express';
import { Url } from '../models/Url';
import validUrl from 'valid-url';
import { encodeBase62 } from '../utils/base62'; // Your Base62 encoder
import mongoose from 'mongoose';


export const createShortUrl = async (req: Request, res: Response) => {
    const baseUrl = process.env.BASE_URL

    const { longUrl, expiresInDays } = req.body;
    console.log(!validUrl.isUri(longUrl));


    if (!validUrl.isUri(longUrl)) {

        return res.status(400).json('Invalid URL');
    }

    try {
        let url = await Url.findOne({ longUrl });
        if (url) {
            return res.json(url);
        }

        const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : null

        url = new Url({
            longUrl,
            createdAt: new Date(),
            expiresAt,
            clicks: 0,
        });

        const savedUrl = await url.save();

        const objectId = savedUrl._id as mongoose.Types.ObjectId;
        const urlCode = encodeBase62(parseInt(objectId.toString(), 16));

        const shortUrl = `${baseUrl}/${urlCode}`;

        savedUrl.shortUrl = shortUrl;
        savedUrl.urlCode = urlCode;
        await savedUrl.save();

        return res.json(savedUrl);
    } catch (err) {
        console.error(err);
        return res.status(500).json('Server error');
    }
};



export const redirectToLongUrl = async (req: Request, res: Response) => {
    const { code } = req.params;

    try {
        const url = await Url.findOne({ urlCode: code });

        if (url?.shortUrl) {
            if (url.expiresAt && new Date() > url.expiresAt) {
                return res.status(410).json({ message: 'This URL has expired' });
            }
            url.clicks += 1
            await url.save();
            return res.redirect(url.longUrl);
        } else {
            return res.status(404).json({ message: 'Short URL not found.' });
        }
    } catch (err) {
        console.error('Error redirecting:', err);
        return res.status(500).json('Server error');
    }
};

