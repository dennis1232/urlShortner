import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import { Url } from '../models/Url';

beforeAll(async () => {
    const mongoUri = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/urlShortenerTest';
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await Url.deleteMany({});
    await mongoose.connection.close();
});

describe('POST /shorten', () => {
    it('should create a short URL with expiration', async () => {
        const response = await request(app)
            .post('/shorten')
            .send({
                longUrl: 'https://www.example.com'
            })
            .expect(200);


        expect(response.body).toHaveProperty('shortUrl');
        expect(response.body).toHaveProperty('expiresAt');
        expect(response.body.longUrl).toBe('https://www.example.com');

        const expiresAt = new Date(response.body.expiresAt);
        expect(expiresAt.getTime()).toBeGreaterThan(Date.now());

        const urlInDb = await Url.findOne({ longUrl: 'https://www.example.com' });
        expect(urlInDb).not.toBeNull();
        expect(urlInDb!.expiresAt).toBeDefined();
    });
});
