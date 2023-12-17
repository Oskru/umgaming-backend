import express from 'express';
import cors from 'cors';
import { router as randomizeRewardRoutes } from './routes/randomize-reward.js';

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use('/randomize-reward', randomizeRewardRoutes);

// start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

// log all process.env variables
console.log(process.env.PORT);
