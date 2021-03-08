const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;


var users = [];

var exampleUser = {
  'name' : 'Jane Doe',
  'mail' : 'jane@doe.fr'
}

var exampleMessage = {
  'from' : 'jane@doe.fr',
  'message' : 'Some message'
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
