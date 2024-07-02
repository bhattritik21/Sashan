// server.js or index.js

import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8000;

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cors());
app.use(express.json());

app.post('/api/image', async (req, res) => {
  try {
    const { url } = req.body;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.writeHead(200, {
      'Content-Type': response.headers.get('content-type'),
      'Content-Length': buffer.length,
      'Access-Control-Allow-Origin': '*',
    });
    res.end(buffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
