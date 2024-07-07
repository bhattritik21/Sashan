// server.js or index.js

import express from 'express';
//import path from 'path';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8000;

// const __dirname = path.resolve();

// app.use(express.static(path.join(__dirname, 'client/build')));
const corsOptions = {
  origin: '*', // Allow requests from this origin (your frontend during development)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
};

app.use(cors(corsOptions));
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
app.get('/api/name', (req, res) => {
  const name = 'John Doe'; // Replace with your desired name or data retrieval logic
  res.json({ name });
});

// Serve React app for all other routes
app.get('/', (req, res) => {
  //res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
   res.send('Hello');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
