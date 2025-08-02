import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});