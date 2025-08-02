import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const farms = [];

app.get('/api/farms', (req, res) => {
  res.json(farms);
});

app.post('/api/farms', (req, res) => {
  const { name, image = '', replicas = 1 } = req.body;
  if (!name) return res.status(400).send('name required');
  if (farms.some(f => f.name === name)) return res.status(409).send('farm exists');
  farms.push({ name, image, replicas });
  res.status(201).json({ ok: true });
});

app.post('/api/farms/:name/scale', (req, res) => {
  const farm = farms.find(f => f.name === req.params.name);
  if (!farm) return res.status(404).send('not found');
  const delta = Number(req.body.delta) || 0;
  farm.replicas = Math.max(0, farm.replicas + delta);
  res.json(farm);
});

app.post('/api/farms/:name/upgrade', (req, res) => {
  const farm = farms.find(f => f.name === req.params.name);
  if (!farm) return res.status(404).send('not found');
  const { image } = req.body;
  if (!image) return res.status(400).send('image required');
  farm.image = image;
  res.json(farm);
});

app.use(express.static(path.join(__dirname, 'client')));

app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
});
