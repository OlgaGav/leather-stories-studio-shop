import express from 'express';
import { generateStampSTL } from '../stamp/generateStampCyrillic.js';

const stampRouter = express.Router();

stampRouter.get('/stamp.stl', (req, res) => {
  const label = (req.query.text || 'WALLET').toString().slice(0, 20); // safety limit
  const buf = generateStampSTL({ label });

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="stamp-${label}.stl"`);
  res.send(buf);
});

export default stampRouter;
