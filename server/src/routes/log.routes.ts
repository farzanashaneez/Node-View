import express from 'express';
import { saveLog } from '../controllers/log.controller';

const router = express.Router();

router.post('/logError', saveLog);

export default router;
