import cors from 'cors';
import express from 'express';

export const createExpressApp = () => {
  const app = express();

  app.use(cors());

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  return app;
};
