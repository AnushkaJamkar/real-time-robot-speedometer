const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const pool = require('./db');

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://real-time-robot-speedometer.vercel.app",
    methods: ["GET", "POST"],
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

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});