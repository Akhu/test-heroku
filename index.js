const express = require('express');
const app = express();
const httpRequester = require('http');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

console.log(process.env.GIPHY_API_KEY);
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
    if (msg.includes('/gif')) {
      let query = msg.split(' ')[1];
      callGify(query);
    }
    io.emit('chat message', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});


function callGify(query){
  //https://api.giphy.com/v1/gifs/search?api_key=gUDP1beHuekoonSB2Nim24tYJ6BM0pas&q=cat&limit=1&offset=0&rating=g&lang=en
  //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
  var options = {
    host: 'api.giphy.com',
    path: '/v1/gifs/search?api_key=' + process.env.GIPHY_API_KEY + '&q=' + query + '&limit=1&offset=0&rating=g&lang=en'
  };

  callback = function(response) {
    var str = '';

    //another chunk of data has been received, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been received, so we just print it out here
    response.on('end', function () {
      console.log(str);
      
      let jsonValue = JSON.parse(str);
      console.log(jsonValue.data[0].images.downsized.url);
      io.emit('gif', jsonValue.data[0].images.downsized.url);
    });
  }

  httpRequester.request(options, callback).end();
}