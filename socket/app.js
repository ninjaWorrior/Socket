var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var count =0;
app.get('/', function(req, res) {
   res.sendfile('index.html');
});
const localtunnel = require('localtunnel');
const { url } = require('inspector');

(async () => {
  const tunnel = await localtunnel({ port: 8000 });

  // the assigned public url for your tunnel
  // i.e. https://abcdefgjhij.localtunnel.me
  url="http://honey.locaktunnel.me"
  tunnel.url;

  tunnel.on('close', () => {
    // tunnels are closed
  });
})();


//Whenever someone connects this gets executed
io.on('connection', function(socket) {
    count=count+1;
   console.log('Number of user connected',count);

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
       count=count-1;
      console.log('disconnected some user Now remaining user connected',count);
   });
});

http.listen(8000, function() {
   console.log('listening on *:8000');
});