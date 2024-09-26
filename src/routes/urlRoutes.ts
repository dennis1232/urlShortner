import { Router } from 'express';
import { createShortUrl, redirectToLongUrl } from '../controllers/urlController';

const router = Router();

router.post('/shorten', createShortUrl);
router.get('/:code', redirectToLongUrl);

export default router;
