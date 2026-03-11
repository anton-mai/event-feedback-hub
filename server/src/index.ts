import cors from 'cors';
import express from 'express';

const DEFAULT_PORT = '4000';
const PORT = process.env.PORT ?? DEFAULT_PORT;

const app = express();

app.use(cors());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
