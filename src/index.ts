import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { router } from './routes/index.ts';
import { WebSocket } from 'http';

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

const port = process.env.PORT || 3004;

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});

const wss = new WebSocket({ server });
