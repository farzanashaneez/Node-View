import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import treeRouter from './routes/tree.route';
import logRouter  from './routes/tree.route';

import { connectDB } from './config/db';

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1', treeRouter);
app.use('/api/v1/log-error', logRouter);

const initiateServer = async () => {
  await connectDB();

  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
  });
};

initiateServer();