import express from 'express';
import { generateShortlist, getShortlist } from '../controllers/shortlistController.js';

const router = express.Router();

router.get('/scan', generateShortlist);       // Run scanner manually
router.get('/', getShortlist);                // View latest shortlist

export default router;
