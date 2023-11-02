import SonyCamera from '@ch-four-cuts/sony-camera';
import express from 'express';
import http from 'http';
import socket from 'socket.io';

const app = express();
const server = new http.Server(app);
const io = new socket.Server(server);

const cam = new SonyCamera({ debug: true });

cam.on('update', (event, ...args) => {
  io.emit('update', event, args[0]);
});
cam.on('liveviewJpeg', (image) => {
  if (image) io.emit('image', image.toString('base64'));
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/jquery.js', function (req, res) {
  res.sendFile(__dirname + '/public/jquery.js');
});

app.get('/connect', (req, res) => {
  cam.connect((error) => {
    console.log('errorrred', error);
  });
  res.status(200).send('Connected');
});

io.on('connection', function (socket) {
  io.emit('params', cam.params);

  socket.on('capture', function () {
    cam.capture(true, function (err, name, image) {
      if (err) {
        return io.emit('status', 'Error: ' + err);
      }
      if (image) io.emit('image', image.toString('base64'));
      if (name && !image) io.emit('status', 'new photo: ' + name);
    });
  });

  socket.on('startViewfinder', function () {
    cam.startViewfinder();
  });

  socket.on('stopViewfinder', function () {
    cam.stopViewfinder();
  });

  socket.on('set', function (param, value) {
    cam.set(param, value);
  });
});

server.listen(3001, () => {
  console.log('Server listening on port http://localhost:3001');
});
