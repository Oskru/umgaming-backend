import express from 'express';
import { randomizeRewardController } from '../controllers/randomize-reward.js';

export const router = express.Router();

router.post('/', randomizeRewardController);
