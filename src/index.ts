import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { router } from './routes/index.ts';
import { WebSocketServer } from 'ws';

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3004;

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});

const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  console.log('User connected');

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
  });

  ws.on('close', () => {
    console.log('User disconnected');
  });
});

app.set('wss', wss);

app.use(router);
