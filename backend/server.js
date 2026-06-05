const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

setInterval(async () => {
  const speed = Math.floor(Math.random() * 120);

  try {
    await pool.query(
      'INSERT INTO speed_data(speed) VALUES($1)',
      [speed]
    );

    io.emit('speedUpdate', speed);

    console.log('Speed:', speed);
  } catch (err) {
    console.error(err);
  }
}, 1000);

app.get('/', (req, res) => {
  res.send('Backend Running');
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});