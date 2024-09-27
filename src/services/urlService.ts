import { Url } from '../models/Url';
import validUrl from 'valid-url';
import { encodeBase62 } from '../utils/base62';
import mongoose from 'mongoose';
import { ERROR_MESSAGE } from '../utils/errorHandler';

export const createShortUrlService = async (longUrl: string, expiresInDays: number | undefined, baseUrl: string) => {
    if (!validUrl.isUri(longUrl)) {
        throw new Error(ERROR_MESSAGE.InvalidUrl);
    }

    let url = await Url.findOne({ longUrl });
    if (url) {
        return url;
    }

    const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : null;

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

    return savedUrl;
};

export const redirectToLongUrlService = async (urlCode: string) => {
    const url = await Url.findOne({ urlCode });

    if (!url) {
        throw new Error(ERROR_MESSAGE.ShortUrlNotFound);
    }

    if (url.expiresAt && new Date() > url.expiresAt) {
        throw new Error(ERROR_MESSAGE.UrlExpired);
    }

    url.clicks += 1;
    await url.save();

    return url;
};
